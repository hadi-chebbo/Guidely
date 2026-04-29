import { NextRequest, NextResponse } from "next/server";

// TODO: finalize cookie names once backend login wires up Sanctum session.
// Frontend middleware is UX-only — the backend role:admin middleware is the
// real authority on API calls.
const TOKEN_COOKIE = "auth_token";
const ROLE_COOKIE  = "user_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes
  if (pathname.startsWith("/login") || 
      pathname.startsWith("/register") || 
      pathname.startsWith("/forgot-password") || 
      pathname.startsWith("/verify-email")) {
    return NextResponse.next();
  }

  // Protect admin routes - require admin role
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    const role  = request.cookies.get(ROLE_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Protect other authenticated routes - require any authenticated user
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
