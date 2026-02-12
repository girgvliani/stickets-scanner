import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for scanner token in cookie (synced from localStorage by layout)
  const hasToken = request.cookies.get("scanner-token")?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // No token + protected path → redirect to login
  if (!hasToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has token + login page → redirect to scan
  if (hasToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/scan", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
