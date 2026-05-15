import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  // Public auth routes
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    if (session) {
      const role = (session.user as Record<string, unknown>).role;
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      const onboarding = (session.user as Record<string, unknown>).onboardingComplete;
      if (!onboarding) {
        return NextResponse.redirect(new URL("/student/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    const role = (session.user as Record<string, unknown>).role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  // Student routes
  if (pathname.startsWith("/student")) {
    const role = (session.user as Record<string, unknown>).role;
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/admin/:path*",
    "/student/:path*",
  ],
};
