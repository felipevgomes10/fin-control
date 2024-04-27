import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
    } & DefaultSession["user"];
  }
}

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [GitHub],
});
