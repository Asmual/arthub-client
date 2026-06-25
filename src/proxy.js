import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|Images).*)",
  ],
};