import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — list all sessions for the current user
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, role: true },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create a new session
export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        title: "New Chat",
      },
    });

    return NextResponse.json(chatSession, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
