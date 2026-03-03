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

    // Check for existing in-progress cluster assessment
    let assessment = await prisma.assessment.findFirst({
      where: {
        userId: session.user.id,
        type: "CLUSTER",
        status: "IN_PROGRESS",
      },
    });

    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          userId: session.user.id,
          type: "CLUSTER",
        },
      });
    }

    // Get ALL questions for student's class level
    const allQuestions = await prisma.question.findMany({
      where: {
        isActive: true,
        forAssessment: "CLUSTER",
        classMin: { lte: profile.classLevel },
        classMax: { gte: profile.classLevel },
      },
      include: {
        options: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, text: true },
        },
      },
    });

    // Randomly select ~40 questions, balanced across types
    const TOTAL_QUESTIONS = 40;
    const typeGroups: Record<string, typeof allQuestions> = {};
    for (const q of allQuestions) {
      if (!typeGroups[q.type]) typeGroups[q.type] = [];
      typeGroups[q.type].push(q);
    }

    // Shuffle each group
    const shuffle = <T>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const types = Object.keys(typeGroups);
    const perType = Math.floor(TOTAL_QUESTIONS / types.length);
    let selected: typeof allQuestions = [];

    // Pick balanced number from each type
    for (const type of types) {
      const shuffled = shuffle(typeGroups[type]);
      selected.push(...shuffled.slice(0, perType));
    }

    // Fill remaining with random picks from any type
    const remaining = allQuestions.filter((q) => !selected.includes(q));
    const extra = shuffle(remaining).slice(0, TOTAL_QUESTIONS - selected.length);
    selected.push(...extra);

    // Final shuffle
    selected = shuffle(selected);

    return NextResponse.json({
      assessmentId: assessment.id,
      questions: selected.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Test questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
