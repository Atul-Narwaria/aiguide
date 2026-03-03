import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const type = request.nextUrl.searchParams.get("type");
    const search = request.nextUrl.searchParams.get("search");
    const clusterId = request.nextUrl.searchParams.get("clusterId");
    const assessment = request.nextUrl.searchParams.get("assessment");
    
    const where: any = {};
    if (type) where.type = type;
    if (assessment) where.forAssessment = assessment;
    if (search) {
      where.OR = [
        { text: { contains: search } },
        { options: { some: { text: { contains: search } } } }
      ];
    }
    if (clusterId) {
      where.options = {
        ...where.options,
        some: {
          ...where.options?.some,
          weights: { some: { clusterId } }
        }
      };
    }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "100", 10);
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
            include: {
              weights: {
                include: { cluster: { select: { name: true } } },
              },
            },
          },
        },
      }),
      prisma.question.count({ where })
    ]);
    
    return NextResponse.json({
      data: questions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, type, classMin, classMax, forAssessment, options } = await request.json();

    const question = await prisma.question.create({
      data: {
        text,
        type,
        classMin,
        classMax,
        forAssessment,
        options: {
          create: options.map((opt: { text: string; weights: Array<{ clusterId: string; weight: number }> }, idx: number) => ({
            text: opt.text,
            sortOrder: idx,
            weights: {
              create: opt.weights.map((w: { clusterId: string; weight: number }) => ({
                clusterId: w.clusterId,
                weight: w.weight,
              })),
            },
          })),
        },
      },
      include: { options: { include: { weights: true } } },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || (session.user as Record<string, unknown>).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, text, type, classMin, classMax, forAssessment, options } = await request.json();

    // Delete existing options and recreate
    await prisma.questionOption.deleteMany({ where: { questionId: id } });

    const question = await prisma.question.update({
      where: { id },
      data: {
        text,
        type,
        classMin,
        classMax,
        forAssessment,
        options: {
          create: options.map((opt: { text: string; weights: Array<{ clusterId: string; weight: number }> }, idx: number) => ({
            text: opt.text,
            sortOrder: idx,
            weights: {
              create: opt.weights.map((w: { clusterId: string; weight: number }) => ({
                clusterId: w.clusterId,
                weight: w.weight,
              })),
            },
          })),
        },
      },
      include: { options: { include: { weights: true } } },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Failed to update question:", error);
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
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
