import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [user, assessments] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { slug: true },
      }),
      // All completed CLUSTER assessments ordered newest first
      prisma.assessment.findMany({
        where: {
          userId: session.user.id,
          status: "COMPLETED",
          type: "CLUSTER",
        },
        orderBy: { completedAt: "desc" },
        include: {
          results: {
            orderBy: { rank: "asc" },
            take: 5,
            include: { cluster: { select: { name: true, icon: true, color: true } } },
          },
          recommendation: {
            select: {
              bestFitBranch: true,
              backup1Branch: true,
              backup2Branch: true,
            },
          },
        },
      }),
    ]);

    const slug = user?.slug ?? null;

    const history = assessments.map((a, idx) => ({
      id: a.id,
      type: a.type,
      resultNumber: idx + 1, // 1 = latest
      completedAt: a.completedAt,
      topClusters: a.results.map((r) => ({
        name: r.cluster.name,
        icon: r.cluster.icon,
        color: r.cluster.color,
        percentage: r.percentage,
        rank: r.rank,
      })),
      recommendation: a.recommendation,
    }));

    return NextResponse.json({ history, slug });
  } catch (error) {
    console.error("Results history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
