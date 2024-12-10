/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  UmojaLinnLoginResponse,
  UmojaLinnUser,
  UmojaLinnUserRole,
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
