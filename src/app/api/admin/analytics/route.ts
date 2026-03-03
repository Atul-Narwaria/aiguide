import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalStudents, totalCareers, totalQuestions, completedAssessments] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.careerCluster.count(),
      prisma.question.count(),
      prisma.assessment.count({ where: { status: "COMPLETED" } }),
    ]);

    const recentStudents = await prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({
      totalStudents,
      totalCareers,
      totalQuestions,
      completedAssessments,
      recentStudents,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
