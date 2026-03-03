import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clusters = await prisma.careerCluster.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        branches: { orderBy: { sortOrder: "asc" } },
        _count: { select: { branches: true } },
      },
    });
    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Failed to fetch careers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, icon, color, salary, colleges, education, growth, examKey } = await request.json();
    const cluster = await prisma.careerCluster.create({
      data: { name, description, icon, color, salary, colleges, education, growth, examKey },
    });
    return NextResponse.json(cluster, { status: 201 });
  } catch (error) {
    console.error("Failed to create cluster:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, description, icon, color, salary, colleges, education, growth, examKey } = await request.json();
    const cluster = await prisma.careerCluster.update({
      where: { id },
      data: { name, description, icon, color, salary, colleges, education, growth, examKey },
    });
    return NextResponse.json(cluster);
  } catch (error) {
    console.error("Failed to update cluster:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await prisma.careerCluster.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete cluster:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
