// import NextAuth from "next-auth";
// import { authConfig } from "./auth/auth";

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { config as appConfig } from "./config/config";

export async function middleware(request: NextRequest) {
  const cookiesStore = cookies();
  const localeCookie = cookiesStore.get("user.locale");
  const session = cookiesStore.get("authjs.session-token");

  if (!session || !localeCookie) return;

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = appConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${localeCookie.value}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|login|not-found).*)"],
};
