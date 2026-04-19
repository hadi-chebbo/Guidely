import { NextRequest, NextResponse } from "next/server";

// TODO: finalize cookie names once backend login wires up Sanctum session.
// Frontend middleware is UX-only — the backend role:admin middleware is the
// real authority on API calls.
const TOKEN_COOKIE = "auth_token";
const ROLE_COOKIE  = "user_role";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

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

export const config = {
  matcher: ["/admin/:path*"],
};
