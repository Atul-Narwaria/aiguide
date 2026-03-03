import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, clusterId, competition, effort } = await request.json();
    const branch = await prisma.careerBranch.create({
      data: { name, description, clusterId, competition, effort },
    });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Failed to create branch:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name, description, competition, effort } = await request.json();
    const branch = await prisma.careerBranch.update({
      where: { id },
      data: { name, description, competition, effort },
    });
    return NextResponse.json(branch);
  } catch (error) {
    console.error("Failed to update branch:", error);
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
    await prisma.careerBranch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete branch:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
