import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20)
    .replace(/-$/, "");
  const suffix = randomBytes(3).toString("hex"); // 6 hex chars
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a unique slug (retry up to 5 times on collision)
    let slug = generateSlug(name);
    for (let i = 0; i < 5; i++) {
      const conflict = await prisma.user.findUnique({ where: { slug } });
      if (!conflict) break;
      slug = generateSlug(name);
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        slug,
        role: role === "ADMIN" ? "ADMIN" : "STUDENT",
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name, role: user.role, slug: user.slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

