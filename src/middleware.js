import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes (e.g., all dashboards)
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Check for the session cookie (Better Auth default name)
  // Use the secure cookie name if in production, or the standard one
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // If trying to access a dashboard without a session, redirect to login
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configuration to specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images (your custom public images folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|Images).*)",
  ],
};
