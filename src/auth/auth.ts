import { emailTemplateHtml } from "@/app/login/components/sign-in-email-template/sign-in-email-template-html";
import { env } from "@/env/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import ResendProvider from "next-auth/providers/resend";
import { Resend } from "resend";
import { prisma } from "~/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      locale: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    GitHubProvider,
    ResendProvider({
      apiKey: env.server.AUTH_RESEND_KEY,
      from: env.server.AUTH_RESEND_DOMAIN,
      sendVerificationRequest: async ({ identifier: to, provider, url }) => {
        try {
          const resend = new Resend(provider.apiKey);
          const { error } = await resend.emails.send({
            from: provider.from,
            to: [to],
            subject: "Sign in to Fin Control",
            html: await emailTemplateHtml({ to, url }),
          });

          if (error) throw new Error(`Failed to send email: ${error.message}`);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
      });

      session.user.locale = userSettings?.locale ?? "en-US";
      session.user.id = user.id;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/me"];
      const isProtected = paths.some((path) => {
        return nextUrl.pathname.startsWith(path);
      });

      if (!isLoggedIn && isProtected) {
        const redirectUrl = new URL("/login", nextUrl.origin);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
