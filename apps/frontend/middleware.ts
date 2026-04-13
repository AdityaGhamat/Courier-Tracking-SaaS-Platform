import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/register-customer",
  "/api/proxy/auth/login",
  "/api/proxy/auth/register-tenant",
  "/api/proxy/auth/register-customer",
  "/api/proxy/track",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow static files, Next internals, and API proxy
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/proxy")
  ) {
    return NextResponse.next();
  }

  const sessionKey = req.cookies.get("session_key")?.value;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Not logged in → redirect to login (except public pages)
  if (!sessionKey && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → don't let them re-visit login/register
  if (sessionKey && isPublic && pathname !== "/") {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
