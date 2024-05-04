// import NextAuth from "next-auth";
// import { authConfig } from "./auth/auth";

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { createClient } from "@libsql/client";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth/auth";
import { config as appConfig } from "./config/config";
import { env } from "./env/env";

// Get the preferred locale, similar to the above or using a library
async function getLocale({ userId }: { userId: string }) {
  const db = createClient({
    url: env.server.LOCAL_DB_URL || env.server.TURSO_DATABASE_URL,
    authToken: env.server.TURSO_AUTH_TOKEN,
  });

  const { rows } = await db.execute({
    sql: "SELECT locale FROM UserSettings WHERE userId = ?",
    args: [userId],
  });

  if (!rows[0].locale) return { locale: "en-US" };
  return { locale: rows[0].locale };
}

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session) return;

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = appConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const { locale } = await getLocale({ userId: session.user.id });
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
