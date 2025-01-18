import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/sign-in";
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthCallback = req.nextUrl.pathname.startsWith("/api/auth");

  // Skip middleware for auth callbacks
  if (isAuthCallback) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn && isDashboardPage) {
    const signInUrl = new URL("/sign-in", req.nextUrl);
    // Store the full URL as callback
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.toString());
    return Response.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Configure middleware matchers
export const config = {
  matcher: [
    // Match all dashboard routes
    "/dashboard/:path*",
    // Match sign-in page
    "/sign-in",
    // Skip all API and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
