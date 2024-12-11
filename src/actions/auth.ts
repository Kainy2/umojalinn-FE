import { clientAxios } from "@/lib/axios";
import { UmojaLinnLoginResponse, UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";
import crypto from "crypto";

export const login = (body: {
  email: string;
  password: string;
  inviterTag?: string;
}) =>
  clientAxios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
  >("/auth/login", body);

export const createAccount = (body: {
  firstName: string;
  lastName: string;
  email: string;
  inviterTag?: string;
  password: string;
}) =>
  clientAxios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
  >("/auth/create-account", body);

export const requestEmailVerification = (email: string) =>
  clientAxios.post<unknown, AxiosResponse<SingleApiResponse, unknown>>(
    "/auth/request-email-verification",
    { email }
  );

export const forgotPassword = (email: string) =>
  clientAxios.post<unknown, AxiosResponse<SingleApiResponse, unknown>>(
    "/auth/forgot-password",
    { email }
  );

export const verifyEmail = (token: string) =>
  clientAxios.post<unknown, AxiosResponse<SingleApiResponse, unknown>>(
    "/auth/verify-email",
    {
      token,
    }
  );

export const resetPassword = (body: {
  password: string;
  confirmPassword: string;
  token: string;
}) =>
  clientAxios.post<unknown, AxiosResponse<SingleApiResponse, unknown>>(
    "/auth/reset-password",
    body
  );

export const retrieveUserInfoFromGoogle = async (
  body: Partial<Record<keyof UmojaLinnUser, string>>
) => {
  // return;
  let hash: string = "";
  try {
    hash = crypto
      .createHmac("sha512", process.env.SERVER_SECRET || "")
      .update(JSON.stringify(body))
      .digest("hex");

    const res = await clientAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
    >("/auth/google-auth", body, {
      headers: {
        "x-social-signature": hash,
      },
    });
    return res;
  } catch (error) {
    console.error(
      error,
      "RETRIEVE <<<",
      process.env.SERVER_SECRET,
      "<<< SERVER SECRET",
      hash,
      "<<< HASH",
      body,
      "<<< BODY"
    );
    return null;
  }
};
