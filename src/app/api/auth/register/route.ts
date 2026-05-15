import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20)
    .replace(/-$/, "");
  const suffix = randomBytes(3).toString("hex"); // 6 hex chars
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role, guestSession } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a unique slug (retry up to 5 times on collision)
    let slug = generateSlug(name);
    for (let i = 0; i < 5; i++) {
      const conflict = await prisma.user.findUnique({ where: { slug } });
      if (!conflict) break;
      slug = generateSlug(name);
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        slug,
        role: role === "ADMIN" ? "ADMIN" : "STUDENT",
      },
    });

    // ── Import guest session if provided ──────────────────────────────────
    if (guestSession && typeof guestSession === "object") {
      const gs = guestSession as {
        classLevel?: number;
        topCodes?: Array<{ code: string; score: number; percentage: number }>;
        clusters?: Array<{ name: string; score: number; percentage: number }>;
        completedAt?: string;
      };

      const classLevel =
        typeof gs.classLevel === "number" && gs.classLevel > 0
          ? gs.classLevel
          : 10;

      // Create student profile with onboarding marked complete
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          classLevel,
          onboardingComplete: true,
        },
      });

      // If the guest completed the assessment, save the results
      if (Array.isArray(gs.clusters) && gs.clusters.length > 0) {
        const assessment = await prisma.assessment.create({
          data: {
            userId: user.id,
            type: "CLUSTER",
            status: "COMPLETED",
            completedAt: gs.completedAt ? new Date(gs.completedAt) : new Date(),
          },
        });

        for (let rank = 0; rank < gs.clusters.length; rank++) {
          const c = gs.clusters[rank];
          // Fuzzy match: find cluster whose name contains the guest cluster name
          const cluster = await prisma.careerCluster.findFirst({
            where: { name: { contains: c.name.split("/")[0].trim() } },
          });
          if (cluster) {
            await prisma.assessmentResult.create({
              data: {
                assessmentId: assessment.id,
                clusterId: cluster.id,
                score: c.score,
                percentage: c.percentage,
                rank: rank + 1,
              },
            });
          }
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name, role: user.role, slug: user.slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

