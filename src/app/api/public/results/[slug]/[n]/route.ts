import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; n: string }> }
) {
  const { slug, n } = await params;
  const resultIndex = Math.max(1, parseInt(n, 10) || 1) - 1; // 0-based

  try {
    const user = await prisma.user.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch all completed CLUSTER assessments ordered newest → oldest
    const clusterAssessments = await prisma.assessment.findMany({
      where: { userId: user.id, type: "CLUSTER", status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      include: {
        results: {
          orderBy: { rank: "asc" },
          take: 8,
          include: { cluster: { select: { name: true, icon: true, color: true } } },
        },
        recommendation: true,
      },
    });

    if (clusterAssessments.length === 0 || resultIndex >= clusterAssessments.length) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    const clusterAssessment = clusterAssessments[resultIndex];
    const totalResults = clusterAssessments.length;

    // Find the nearest BRANCH assessment (completed at or before cluster completedAt)
    const branchAssessment = await prisma.assessment.findFirst({
      where: {
        userId: user.id,
        type: "BRANCH",
        status: "COMPLETED",
        completedAt: clusterAssessment.completedAt
          ? { lte: clusterAssessment.completedAt }
          : undefined,
      },
      orderBy: { completedAt: "desc" },
      include: {
        branchResults: {
          orderBy: { rank: "asc" },
          take: 5,
          include: {
            branch: { select: { name: true, cluster: { select: { name: true } } } },
          },
        },
        recommendation: true,
      },
    });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: { classLevel: true, school: true, city: true, state: true, selfClaimedCareer: true },
    });

    const clusterResults = clusterAssessment.results.map((r) => ({
      name: r.cluster.name,
      icon: r.cluster.icon,
      color: r.cluster.color,
      percentage: r.percentage,
      rank: r.rank,
    }));

    const branchResults =
      branchAssessment?.branchResults.map((r) => ({
        name: r.branch.name,
        clusterName: r.branch.cluster.name,
        percentage: r.percentage,
        rank: r.rank,
      })) ?? [];

    const recommendation =
      branchAssessment?.recommendation ?? clusterAssessment.recommendation ?? null;

    const topScore = clusterResults[0]?.percentage ?? 0;
    const secondScore = clusterResults[1]?.percentage ?? 0;
    const confidence = Math.min(99, Math.max(40, topScore * 0.6 + (topScore - secondScore) * 2 + 20));

    return NextResponse.json({
      studentName: user.name,
      slug,
      resultNumber: resultIndex + 1,
      totalResults,
      profile,
      clusterResults,
      branchResults,
      recommendation,
      matchConfidence: Math.round(confidence),
      assessmentDate: clusterAssessment.completedAt ?? null,
    });
  } catch (error) {
    console.error("Public results error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
