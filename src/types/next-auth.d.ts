/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  UmojaLinnLoginResponse,
  UmojaLinnUser,
  UmojaLinnUserRole,
  UmojaLinnUserRoleProfile,
} from "./user";

interface UmojaLinnNextAuthSession {
  user: Pick<UmojaLinnUser, "firstName" | "lastName" | "role">;
}

declare module "next-auth/jwt" {
  export type JWT = {
    accessToken: UmojaLinnLoginResponse["authToken"];
    user: {
      hasOnboarded: boolean;
      profileRole: UmojaLinnUserRole | null;
    };
    iat: number;
    exp: number;
    jti: string;
  };
}

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    user: UmojaLinnLoginResponse["user"];
    expires: string;
  }
  export interface User extends UmojaLinnLoginResponse {}
}

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   export type Session = {
//     accessToken: string;
//     user: UmojaLinnLoginResponse["user"];
//   };
//   export interface AdapterUser extends UmojaLinnLoginResponse {}
//   export interface User extends UmojaLinnLoginResponse {}
//   export interface JWT extends Partial<UmojaLinnLoginResponse> {}
// }

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   export interface JWT {
//     accessToken: string;
//   }
//   export interface Session extends UmojaLinnNextAuthSession {}
//   export interface AdapterUser extends UmojaLinnLoginResponse {}
//   export interface User extends UmojaLinnLoginResponse {}
// }
