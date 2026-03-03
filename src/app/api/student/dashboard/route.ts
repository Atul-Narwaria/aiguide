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

    const assessments = await prisma.assessment.findMany({
      where: { userId: session.user.id },
      select: { id: true, type: true, status: true, completedAt: true },
    });

    const clusterAssessment = assessments.find(
      (a) => a.type === "CLUSTER" && a.status === "COMPLETED"
    );
    const branchAssessment = assessments.find(
      (a) => a.type === "BRANCH" && a.status === "COMPLETED"
    );

    return NextResponse.json({
      profile,
      assessments,
      hasClusterResult: !!clusterAssessment,
      hasBranchResult: !!branchAssessment,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
