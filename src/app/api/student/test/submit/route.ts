import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { assessmentId, answers } = await request.json();

    // Verify assessment belongs to user
    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, userId: session.user.id },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Invalid assessment" }, { status: 400 });
    }

    // Save answers
    for (const answer of answers) {
      await prisma.assessmentAnswer.upsert({
        where: {
          assessmentId_questionId: {
            assessmentId,
            questionId: answer.questionId,
          },
        },
        create: {
          assessmentId,
          questionId: answer.questionId,
          optionId: answer.optionId,
        },
        update: {
          optionId: answer.optionId,
        },
      });
    }

    // Calculate scores per career cluster
    const allAnswers = await prisma.assessmentAnswer.findMany({
      where: { assessmentId },
      include: {
        option: {
          include: {
            weights: {
              include: { cluster: true },
            },
          },
        },
      },
    });

    // Compute scores
    const clusterScores: Record<string, { total: number; max: number; name: string }> = {};

    for (const answer of allAnswers) {
      for (const weight of answer.option.weights) {
        if (weight.clusterId && weight.cluster) {
          if (!clusterScores[weight.clusterId]) {
            clusterScores[weight.clusterId] = { total: 0, max: 0, name: weight.cluster.name };
          }
          clusterScores[weight.clusterId].total += weight.weight;
        }
      }
    }

    // Get max possible scores
    const allClusters = await prisma.careerCluster.findMany({ where: { isActive: true } });
    for (const cluster of allClusters) {
      if (!clusterScores[cluster.id]) {
        clusterScores[cluster.id] = { total: 0, max: 0, name: cluster.name };
      }
      // Set max as total questions * max weight (approximate)
      clusterScores[cluster.id].max = allAnswers.length * 3; // Approximate max
    }

    // Save results
    const sortedClusters = Object.entries(clusterScores)
      .map(([clusterId, data]) => ({
        clusterId,
        name: data.name,
        score: data.total,
        percentage: data.max > 0 ? (data.total / data.max) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    // Clear old results and save new
    await prisma.assessmentResult.deleteMany({ where: { assessmentId } });

    for (let i = 0; i < sortedClusters.length; i++) {
      await prisma.assessmentResult.create({
        data: {
          assessmentId,
          clusterId: sortedClusters[i].clusterId,
          score: sortedClusters[i].score,
          percentage: Math.min(sortedClusters[i].percentage, 100),
          rank: i + 1,
        },
      });
    }

    // Mark assessment as completed
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    return NextResponse.json({ success: true, results: sortedClusters.slice(0, 5) });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
