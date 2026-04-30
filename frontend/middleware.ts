import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "auth_token";

/* ───────────────────────────── */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  /* ─────────────────────────────
     1. PROTECT ADMIN ROUTES
  ───────────────────────────── */

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ❗ IMPORTANT:
    // DO NOT trust role cookie here
    // role validation must be done in backend
    // (or via JWT decode if you implement it later)
  }

  /* ─────────────────────────────
     2. PROTECT DASHBOARD ROUTES
  ───────────────────────────── */

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  /* ─────────────────────────────
     3. PUBLIC ROUTES (NO PROTECTION)
     /, /majors, /login, /register, etc.
  ───────────────────────────── */

  return NextResponse.next();
}

/* ───────────────────────────── */

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};