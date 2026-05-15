import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CLUSTER_MAPPING: Record<string, string[]> = {
  R: ["Engineering", "Defence & Security", "Science & Research"],
  I: ["Science & Research", "Technology & IT", "Medical & Healthcare"],
  A: ["Arts & Humanities", "Technology & IT", "Business & Commerce"],
  S: ["Medical & Healthcare", "Education & Teaching", "Government & Civil Services"],
  E: ["Business & Commerce", "Law & Legal", "Government & Civil Services"],
  C: ["Business & Commerce", "Government & Civil Services", "Technology & IT"],
};

const previewCountForClass = (classLevel: number) => {
  if (classLevel >= 11) return 8;
  if (classLevel >= 8) return 6;
  return 5;
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedClassLevel = Number.parseInt(url.searchParams.get("classLevel") || "", 10);
  const classLevel = Number.isFinite(parsedClassLevel) ? parsedClassLevel : 10;

  try {
    const questions = await prisma.question.findMany({
      where: {
        isActive: true,
        forAssessment: "CLUSTER",
        hollandCode: { not: null },
        classMin: { lte: classLevel },
        classMax: { gte: classLevel },
      },
      select: {
        id: true,
        text: true,
        hollandCode: true,
        options: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, text: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const selected = shuffle(questions).slice(0, previewCountForClass(classLevel));

    return NextResponse.json({
      classLevel,
      questions: selected.map((question) => ({
        id: question.id,
        text: question.text,
        type: question.hollandCode || "INTEREST",
        options: question.options,
      })),
    });
  } catch (error) {
    console.error("Public assessment questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = Array.isArray(body.answers) ? body.answers : [];

    if (answers.length === 0) {
      return NextResponse.json({ error: "No answers submitted" }, { status: 400 });
    }

    const answeredQuestions = await prisma.question.findMany({
      where: {
        id: { in: answers.map((answer: { questionId: string }) => answer.questionId) },
      },
      select: { id: true, hollandCode: true },
    });

    const scoreBoard = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    answeredQuestions.forEach((question) => {
      const code = question.hollandCode as keyof typeof scoreBoard | null;
      if (code && code in scoreBoard) {
        scoreBoard[code] += 1;
      }
    });

    const total = Math.max(1, answeredQuestions.length);
    const topCodes = Object.entries(scoreBoard)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code, score]) => ({
        code,
        score,
        percentage: Math.round((score / total) * 100),
      }));

    const clusterScores: Record<string, number> = {};

    topCodes.forEach(({ code }, index) => {
      const clusters = CLUSTER_MAPPING[code] || [];
      const weight = 3 - index;

      clusters.forEach((clusterName) => {
        clusterScores[clusterName] = (clusterScores[clusterName] || 0) + weight;
      });
    });

    const clusters = Object.entries(clusterScores)
      .map(([name, score]) => ({
        name,
        score,
        percentage: Math.min(100, Math.round((score / 6) * 100)),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return NextResponse.json({
      topCodes,
      clusters,
      note:
        "This is a free preview. Sign up to unlock branch-level recommendations, saved results, and full dashboard access.",
    });
  } catch (error) {
    console.error("Public assessment submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}