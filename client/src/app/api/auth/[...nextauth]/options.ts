import { LOGIN_URL } from "@/lib/apiEndPoint";
import axios from "axios";
import { AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Represents a custom session object used for authentication.
 *
 * @interface CustomSession
 *
 * @property {CustomUser} [user] - Optional custom user object containing user-specific information.
 * @property {ISODateString} expires - The expiration date of the session in ISO date string format.
 */
export interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}
export interface CustomUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: CustomUser;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: CustomUser | null }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { data } = await axios.post(LOGIN_URL, credentials);

        const user = data?.data;
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
