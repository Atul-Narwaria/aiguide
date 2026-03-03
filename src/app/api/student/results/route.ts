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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, slug: true },
    });

    // Get cluster results
    const clusterAssessment = await prisma.assessment.findFirst({
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
        recommendation: true,
        answers: {
          include: {
            question: true,
            option: {
              include: {
                weights: {
                  include: { cluster: true },
                },
              },
            },
          },
        },
      },
    });

    // Get branch results
    const branchAssessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "BRANCH",
        status: "COMPLETED",
      },
      orderBy: { completedAt: "desc" },
      include: {
        branchResults: {
          orderBy: { rank: "asc" },
          include: { branch: { include: { cluster: true } } },
        },
        recommendation: true,
      },
    });

    const clusterResults =
      clusterAssessment?.results.map((r) => ({
        name: r.cluster.name,
        percentage: r.percentage,
      })) || [];

    const branchResults =
      branchAssessment?.branchResults.map((r) => ({
        name: r.branch.name,
        clusterName: r.branch.cluster.name,
        percentage: r.percentage,
      })) || [];

    // Calculate per-question-type scores
    const typeScores: Record<string, { total: number; count: number }> = {};
    if (clusterAssessment?.answers) {
      for (const answer of clusterAssessment.answers) {
        const type = answer.question.type;
        const totalWeight = answer.option.weights.reduce(
          (sum, w) => sum + Math.abs(w.weight),
          0
        );
        const maxPossible = answer.option.weights.length > 0 ? answer.option.weights.length * 10 : 1;
        const normalized = (totalWeight / maxPossible) * 100;

        if (!typeScores[type]) {
          typeScores[type] = { total: 0, count: 0 };
        }
        typeScores[type].total += normalized;
        typeScores[type].count += 1;
      }
    }

    const questionTypeBreakdown = Object.entries(typeScores).map(
      ([type, data]) => ({
        type,
        label: type
          .replace("_", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        percentage: Math.min(100, data.count > 0 ? data.total / data.count : 0),
      })
    );

    // Use most recent recommendation
    const recommendation =
      branchAssessment?.recommendation ||
      clusterAssessment?.recommendation ||
      null;

    // Calculate match confidence
    const topScore = clusterResults[0]?.percentage || 0;
    const secondScore = clusterResults[1]?.percentage || 0;
    const confidence = Math.min(
      99,
      Math.max(40, topScore * 0.6 + (topScore - secondScore) * 2 + 20)
    );

    return NextResponse.json({
      recommendation,
      clusterResults,
      branchResults,
      questionTypeBreakdown,
      matchConfidence: Math.round(confidence),
      studentName: user?.name || "Student",
      slug: user?.slug ?? null,
      resultNumber: 1,
      profile: profile
        ? {
            selfClaimedCareer: profile.selfClaimedCareer,
            classLevel: profile.classLevel,
          }
        : null,
      assessmentDate: clusterAssessment?.completedAt || null,
    });
  } catch (error) {
    console.error("Results error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
