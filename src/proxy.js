import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/profile/:path*", "/product/:path*"],
};
