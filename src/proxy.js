import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isDashboardRoute = pathname.startsWith("/dashboard");

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // 1. If trying to access dashboard without being logged in
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Role-Based Routing Protection inside Middleware
  // Better-auth usually session data is fetched via API, but we can secure the sub-paths
  if (sessionCookie) {
    // Note: If you store user role in a separate cookie during login (e.g. 'user_role'), 
    // you can strictly block here. For example:
    const userRole = request.cookies.get("user_role")?.value;

    if (userRole) {
      if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (pathname.startsWith("/dashboard/artist") && userRole !== "artist") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|Images).*)",
  ],
};