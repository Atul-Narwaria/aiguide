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
      return NextResponse.json(
        { error: "Complete onboarding first" },
        { status: 400 },
      );
    }

    // Check for existing in-progress Holland Code assessment (interest-based CLUSTER assessment)
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

    // Get questions based on class level
    // For Class 8-10: 30 questions
    // For Class 11-12: 50 questions
    // For College+: 75 questions
    let classLevel = profile.classLevel;
    let targetCount = 30;

    if (classLevel >= 13) {
      targetCount = 75;
    } else if (classLevel >= 11) {
      targetCount = 50;
    }

    // Get Holland Code questions for the student's class level
    const allQuestions = await prisma.question.findMany({
      where: {
        isActive: true,
        forAssessment: "CLUSTER",
        classMin: { lte: classLevel },
        classMax: { gte: classLevel },
        hollandCode: { not: null },
      },
      include: {
        options: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, text: true },
        },
      },
    });

    // Shuffle and select questions
    const shuffle = <T>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const shuffled = shuffle(allQuestions);
    const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));

    return NextResponse.json({
      assessmentId: assessment.id,
      questions: selected.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.hollandCode || q.type,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Test questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
