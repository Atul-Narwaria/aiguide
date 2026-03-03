import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clusters = await prisma.careerCluster.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
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

    return NextResponse.json({ clusters });
  } catch (error) {
    console.error("Careers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
