/* eslint-disable @typescript-eslint/no-empty-object-type */
import { UmojaLinnLoginResponse, UmojaLinnUserRole } from "./user";

type UmojaLinnJWTUserExtension = {
  hasOnboarded: boolean;
  profileRole: UmojaLinnUserRole | null;
};

declare module "next-auth/jwt" {
  export type JWT = {
    accessToken: UmojaLinnLoginResponse["authToken"];
    user: UmojaLinnJWTUserExtension;
    iat: number;
    exp: number;
    jti: string;
  };
}

declare module "next-auth" {
  export interface Profile {
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
  }
  export interface Session {
    accessToken: string;
    user: Partial<UmojaLinnLoginResponse["user"]> & UmojaLinnJWTUserExtension;
    expires: string;
  }
  export interface User extends UmojaLinnLoginResponse {
    user: Partial<UmojaLinnLoginResponse["user"]> & UmojaLinnJWTUserExtension;
  }
}
