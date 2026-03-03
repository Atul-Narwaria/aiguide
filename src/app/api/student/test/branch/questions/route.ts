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

    if (!profile) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
    }

    // Find the selected career cluster
    const selectedCareer = profile.selfClaimedCareer;
    const cluster = selectedCareer
      ? await prisma.careerCluster.findFirst({
          where: {
            name: { contains: selectedCareer },
            isActive: true,
          },
        })
      : null;

    // Check for existing in-progress branch assessment
    let assessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "BRANCH",
        status: "IN_PROGRESS",
      },
    });

    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          userId: session.user.id,
          type: "BRANCH",
        },
      });
    }

    // Get branch-level questions — try cluster-specific first, then fall back to all BRANCH questions
    const baseWhere = {
      isActive: true,
      forAssessment: "BRANCH" as const,
      classMin: { lte: profile.classLevel },
      classMax: { gte: profile.classLevel },
    };

    let allQuestions = cluster
      ? await prisma.question.findMany({
          where: { ...baseWhere, clusterId: cluster.id },
          include: {
            options: {
              orderBy: { sortOrder: "asc" },
              select: { id: true, text: true },
            },
          },
        })
      : [];

    // Fall back to all BRANCH questions if no cluster-specific ones exist
    if (allQuestions.length === 0) {
      allQuestions = await prisma.question.findMany({
        where: baseWhere,
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
            select: { id: true, text: true },
          },
        },
      });
    }

    // Randomly select 25 questions and shuffle
    const TOTAL_QUESTIONS = Math.min(25, allQuestions.length);
    const shuffle = <T>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const selected = shuffle(allQuestions).slice(0, TOTAL_QUESTIONS);

    return NextResponse.json({
      assessmentId: assessment.id,
      clusterName: selectedCareer || "Career",
      questions: selected.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Branch questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
