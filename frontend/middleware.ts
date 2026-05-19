import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "auth_token";
const ROLE_COOKIE = "user_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const resetPasswordAliases = [
    "/auth/reset-password",
    "/api/v1/auth/reset-password",
  ];

  if (resetPasswordAliases.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/reset-password";
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  const isMentorRoute = pathname.startsWith("/mentor");

  /* ─────────────────────────────
     1. NOT LOGGED IN → BLOCK PROTECTED ROUTES
  ───────────────────────────── */

  if (!token) {
    if (isAdminRoute || isStudentRoute || isMentorRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  /* ─────────────────────────────
     2. ROLE PROTECTION (ADMIN ONLY)
  ───────────────────────────── */

  if (token && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL(role === "mentor" ? "/mentor" : "/student/dashboard", request.url));
  }

  if (token && isMentorRoute && role !== "mentor") {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/student/dashboard", request.url));
  }

  if (token && isStudentRoute && role !== "student") {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/mentor", request.url));
  }

  /* ───────────────────────────── */

  return NextResponse.next();
}

/* ───────────────────────────── */

export const config = {
  matcher: [
    "/auth/reset-password",
    "/api/v1/auth/reset-password",
    "/admin/:path*",
    "/student/:path*",
    "/mentor/:path*",
  ],
};
