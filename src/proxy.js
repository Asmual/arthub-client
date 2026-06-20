import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes (e.g., all dashboards)
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Check for the session cookie (Better Auth default name)
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // If trying to access a dashboard without a session, redirect to login
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configuration to specify which routes this proxy should run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|Images).*)",
  ],
};