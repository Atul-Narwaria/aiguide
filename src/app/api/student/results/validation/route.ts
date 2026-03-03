import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Find completed cluster assessment
    const assessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "CLUSTER",
        status: "COMPLETED",
      },
      orderBy: { completedAt: "desc" },
      include: {
        results: {
          orderBy: { rank: "asc" },
          include: { cluster: true },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "No completed assessment" }, { status: 404 });
    }

    const topClusters = assessment.results.slice(0, 3).map((r) => ({
      name: r.cluster.name,
      percentage: r.percentage,
      rank: r.rank,
    }));

    const selfClaimed = profile?.selfClaimedCareer || null;
    const suggestedCareer = topClusters[0]?.name || "Unknown";

    let claimMatch: "MATCHED" | "MISMATCHED" | "NO_CLAIM" = "NO_CLAIM";
    if (selfClaimed && selfClaimed !== "Not Sure") {
      const selfClaimedLower = selfClaimed.toLowerCase();
      const topCareerLower = suggestedCareer.toLowerCase();
      claimMatch = topCareerLower.includes(selfClaimedLower) ||
        selfClaimedLower.includes(topCareerLower)
        ? "MATCHED"
        : "MISMATCHED";
    }

    return NextResponse.json({
      selfClaimed,
      topClusters,
      claimMatch,
      suggestedCareer,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selectedCareer } = await request.json();

    // Update profile with the career they chose to pursue
    await prisma.studentProfile.update({
      where: { userId: session.user.id },
      data: { selfClaimedCareer: selectedCareer },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Validation choice error:", error);
    return NextResponse.json({ error: "Failed to save choice" }, { status: 500 });
  }
}
