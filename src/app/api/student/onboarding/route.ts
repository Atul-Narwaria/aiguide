import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { classLevel, school, city, state, selfClaimedCareer } = await request.json();

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      await prisma.studentProfile.update({
        where: { userId: session.user.id },
        data: { classLevel, school, city, state, selfClaimedCareer, onboardingComplete: true },
      });
    } else {
      await prisma.studentProfile.create({
        data: {
          userId: session.user.id,
          classLevel,
          school,
          city,
          state,
          selfClaimedCareer: selfClaimedCareer || null,
          onboardingComplete: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
