import CredentialProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { login, retrieveUserInfoFromGoogle } from "@/actions/auth";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,

  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async profile(profile, _tokens) {
        return profile;
      },
    }),
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: "Credentials",
      type: "credentials",

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      // @ts-expect-error Return object type for user is wrong
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const body = credentials as {
          email?: string;
          password?: string;
          inviterTag?: string;
        };

        const res = await login({
          email: body.email || "",
          password: body.password || "",
          inviterTag: body.inviterTag,
        });

        const data = res.data?.data;

        return !!data?.authToken ? data : null;
      },
    }),

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: "jwt",

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60, // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, trigger, user, session, profile, account }) {
      // console.log("JWT", token, session, user, trigger);
      if (trigger === "update") {
        token.user = {
          ...(token.user || {}),
          hasOnboarded:
            !!session?.buyerProfile ||
            !!session?.designerProfile ||
            session?.hasOnboarded,
        };
        return token;
      }

      // TODO: Fix user details retrieval for google auth
      if (account?.provider === "google" && !token.accessToken) {
        // token.accessToken = profile?.email || "";
        const res = await retrieveUserInfoFromGoogle(profile!);
        token.accessToken = res?.data?.data?.authToken || "";
        token.user = {
          hasOnboarded:
            !!res?.data?.data?.user?.buyerProfile ||
            !!res?.data?.data?.user?.designerProfile,
          role: res?.data.data.user?.role!,
        };
      }

      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.accessToken = user.authToken;
        token.user = {
          hasOnboarded:
            !!user.user?.buyerProfile || !!user.user?.designerProfile,
          role: user.user?.role,
        };
      }
      return token;
    },
    async session({ session, trigger, newSession }) {
      // console.log("Session", token, session, trigger, newSession);
      if (trigger === "update") {
        if (newSession.user) return session;
      }

      if (session.user) {
      }

      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email?.endsWith("@example.com") || false;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
};

export function auth( // <-- use this function to access the jwt from React components
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
