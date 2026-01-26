import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-only: no Node APIs, no db/prisma/bcrypt

const protectedPaths = ["/dashboard", "/home", "/wallet", "/games", "/settings"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TODO: Redirect to /home directly to avoid double redirect via /
  if (token && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
