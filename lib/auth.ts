import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the access token to the token object
      if (account)
        token.accessToken = account.access_token;

      return token;
    },
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
