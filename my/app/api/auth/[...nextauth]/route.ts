import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "myapp-frontend",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "", // Используем только из .env
      issuer:
        process.env.KEYCLOAK_URL + "/realms/" + process.env.KEYCLOAK_REALM,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      console.log("JWT Callback:", {
        token,
        account,
        env: process.env.KEYCLOAK_URL,
      });
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      console.log("Session Callback:", { session, token });
      if (session.user && typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
