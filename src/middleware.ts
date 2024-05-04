// import NextAuth from "next-auth";
// import { authConfig } from "./auth/auth";

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth/auth";
import { config as appConfig } from "./config/config";

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session) {
    request.nextUrl.pathname = "/login";
    return NextResponse.redirect(request.nextUrl);
  }

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = appConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${session.user.locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|login|not-found).*)"],
};
