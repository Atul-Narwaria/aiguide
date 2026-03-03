import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clusterId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { clusterId } = await params;

    const cluster = await prisma.careerCluster.findUnique({
      where: { id: clusterId, isActive: true },
      include: {
        branches: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            eligibility: true,
            competition: true,
            effort: true,
          },
        },
      },
    });

    if (!cluster) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    // Get user's assessment result for this cluster if available
    const userResult = await prisma.assessmentResult.findFirst({
      where: {
        clusterId: cluster.id,
        assessment: {
          userId: session.user.id,
          type: "CLUSTER",
          status: "COMPLETED",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      cluster,
      userScore: userResult
        ? { percentage: userResult.percentage, rank: userResult.rank }
        : null,
    });
  } catch (error) {
    console.error("Career detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
