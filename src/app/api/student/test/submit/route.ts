import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Holland Code types and descriptions
const HOLLAND_CODES = {
  R: {
    code: "R",
    title: "Realistic",
    description: "Practical, hands-on, mechanical work",
  },
  I: {
    code: "I",
    title: "Investigative",
    description: "Analytical, scientific, research-oriented",
  },
  A: {
    code: "A",
    title: "Artistic",
    description: "Creative, expressive, design-focused",
  },
  S: {
    code: "S",
    title: "Social",
    description: "Helping, teaching, serving others",
  },
  E: {
    code: "E",
    title: "Enterprising",
    description: "Leadership, business, influencing others",
  },
  C: {
    code: "C",
    title: "Conventional",
    description: "Organized, detail-oriented, structured tasks",
  },
};

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
      return NextResponse.json(
        { error: "Invalid assessment" },
        { status: 400 },
      );
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

    // Get all answers with questions and options (include hollandCode field)

    const allAnswers = await prisma.assessmentAnswer.findMany({
      where: { assessmentId },

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
    });

    // Check if this is a Holland Code assessment (questions with hollandCode field)
    // Use type assertion since hollandCode may not be in type definition yet
    const hasHollandCode = allAnswers.some(
      (a) =>
        (a.question as any).hollandCode !== null &&
        (a.question as any).hollandCode !== undefined,
    );

    if (hasHollandCode) {
      // Calculate Holland Code scores
      const hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

      allAnswers.forEach((answer) => {
        // Use type assertion for hollandCode
        const questionType = (answer.question as any).hollandCode;
        if (questionType && questionType in hollandScores) {
          hollandScores[questionType as keyof typeof hollandScores] += 1;
        }
      });

      // Get dominant codes
      const dominantCodes = Object.entries(hollandScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([code]) => code);

      // Calculate total questions answered (kept for potential future use)

      Object.values(hollandScores).reduce((a, b) => a + b, 0);

      // Save Holland Code results as career clusters for compatibility
      // Map Holland Codes to Career Clusters
      const clusterMapping: Record<string, string[]> = {
        R: ["Engineering", "Defence & Security", "Science & Research"],
        I: ["Science & Research", "Technology & IT", "Medical & Healthcare"],
        A: ["Arts & Humanities", "Technology & IT", "Business & Commerce"],
        S: [
          "Medical & Healthcare",
          "Education & Teaching",
          "Government & Civil Services",
        ],
        E: [
          "Business & Commerce",
          "Law & Legal",
          "Government & Civil Services",
        ],
        C: [
          "Business & Commerce",
          "Government & Civil Services",
          "Technology & IT",
        ],
      };

      // Aggregate scores for career clusters

      const clusterScores: Record<
        string,
        { total: number; max: number; name: string }
      > = {};

      dominantCodes.slice(0, 3).forEach((code, index) => {
        const clusters = clusterMapping[code] || [];
        clusters.forEach((clusterName) => {
          if (!clusterScores[clusterName]) {
            clusterScores[clusterName] = {
              total: 0,
              max: 0,
              name: clusterName,
            };
          }
          // Weight decreases with rank (3 for top, 2 for second, 1 for third)
          const weight = 3 - index;
          clusterScores[clusterName].total += weight;
          clusterScores[clusterName].max += weight;
        });
      });

      // Convert to array and sort
      const sortedClusters = Object.entries(clusterScores)
        .map(([name, data]) => ({
          name,
          score: data.total,
          percentage: data.max > 0 ? (data.total / data.max) * 100 : 0,
        }))
        .sort((a, b) => b.score - a.score);

      // Clear old results and save new
      await prisma.assessmentResult.deleteMany({ where: { assessmentId } });

      // Find cluster IDs for the mapped clusters and save results

      for (const clusterData of sortedClusters) {
        const cluster = await prisma.careerCluster.findFirst({
          where: { name: clusterData.name },
        });

        if (cluster) {
          await prisma.assessmentResult.create({
            data: {
              assessmentId,
              clusterId: cluster.id,
              score: clusterData.score,
              percentage: Math.min(clusterData.percentage, 100),
              rank: sortedClusters.indexOf(clusterData) + 1,
            },
          });
        }
      }

      // Get Holland Code descriptions for the dominant codes
      const hollandResults = dominantCodes.map((code) => ({
        code,
        ...HOLLAND_CODES[code as keyof typeof HOLLAND_CODES],
        score: hollandScores[code as keyof typeof hollandScores],
      }));

      // Mark assessment as completed
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        results: sortedClusters.slice(0, 5),
        hollandCodes: hollandResults,
        recommendations: getRecommendations(hollandResults),
      });
    } else {
      // Original cluster-based calculation
      // Compute scores
      const clusterScores: Record<
        string,
        { total: number; max: number; name: string }
      > = {};

      for (const answer of allAnswers) {
        for (const weight of answer.option.weights) {
          if (weight.clusterId && weight.cluster) {
            if (!clusterScores[weight.clusterId]) {
              clusterScores[weight.clusterId] = {
                total: 0,
                max: 0,
                name: weight.cluster.name,
              };
            }
            clusterScores[weight.clusterId].total += weight.weight;
          }
        }
      }

      // Get max possible scores
      const allClusters = await prisma.careerCluster.findMany({
        where: { isActive: true },
      });
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

      return NextResponse.json({
        success: true,
        results: sortedClusters.slice(0, 5),
      });
    }
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

// Generate recommendations based on Holland Codes
function getRecommendations(
  hollandResults: {
    code: string;
    title: string;
    description: string;
    score: number;
  }[],
) {
  const recommendations: string[] = [];

  if (hollandResults.length === 0) return recommendations;

  const topCode = hollandResults[0].code;

  switch (topCode) {
    case "R":
      recommendations.push(
        "You have strong interests in practical, hands-on activities. Consider careers in engineering, trades, or technical fields.",
        "You prefer working with objects, tools, and machines rather than people. Look for careers that involve building, fixing, or operating equipment.",
      );
      break;
    case "I":
      recommendations.push(
        "You have strong interests in investigative, analytical work. Consider careers in science, research, or technology.",
        "You enjoy solving problems and working with ideas. Look for careers that involve research, analysis, and critical thinking.",
      );
      break;
    case "A":
      recommendations.push(
        "You have strong interests in artistic, creative work. Consider careers in design, writing, or performing arts.",
        "You prefer unstructured work that allows for self-expression. Look for careers that involve creativity and originality.",
      );
      break;
    case "S":
      recommendations.push(
        "You have strong interests in social, helping work. Consider careers in education, healthcare, or social services.",
        "You enjoy working with people to inform, train, or help them. Look for careers that involve teaching, counseling, or service.",
      );
      break;
    case "E":
      recommendations.push(
        "You have strong interests in enterprising, leadership work. Consider careers in business, management, or sales.",
        "You enjoy leading, persuading, and achieving goals. Look for careers that involve sales, marketing, or entrepreneurship.",
      );
      break;
    case "C":
      recommendations.push(
        "You have strong interests in conventional, organized work. Consider careers in administration, finance, or operations.",
        "You prefer structured tasks and working with data. Look for careers that involve organization, precision, and systems.",
      );
      break;
  }

  if (hollandResults.length > 1) {
    const secondCode = hollandResults[1].code;
    if (secondCode !== topCode) {
      recommendations.push(
        `Your secondary interest in ${HOLLAND_CODES[secondCode as keyof typeof HOLLAND_CODES].title.toLowerCase()} suggests you might enjoy roles that combine your top two interests.`,
      );
    }
  }

  return recommendations;
}
