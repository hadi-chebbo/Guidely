import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "auth_token";
const ROLE_COOKIE = "user_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");

  /* ─────────────────────────────
     1. NOT LOGGED IN → BLOCK PROTECTED ROUTES
  ───────────────────────────── */

  if (!token) {
    if (isAdminRoute || isStudentRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  /* ─────────────────────────────
     2. ROLE PROTECTION (ADMIN ONLY)
  ───────────────────────────── */

  if (token && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (token && isStudentRoute && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  /* ───────────────────────────── */

  return NextResponse.next();
}

/* ───────────────────────────── */

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
  ],
};
