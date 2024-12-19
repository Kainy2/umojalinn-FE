import axios from "axios";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "./auth";

export const clientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const customAxios = axios.create({
  baseURL: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL,
});

// export const setToken = (token?: string) => {
//   if (token) {
//     customAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
//   }
// };

export const setBearerToken = async (req: NextRequest) => {
  const session = await getToken({ req });

  customAxios.defaults.headers.common.Authorization = `Bearer ${session?.accessToken}`;

  console.log(session);

  return session;
};

export const handleAPIError = (error: unknown) => {
  console.error("API Error:", error);

  if (error && typeof error === "object") {
    if ("isAxiosError" in error) {
      const axiosError = error as AxiosError;

      const status = axiosError.response?.status || 503;
      const statusText =
        axiosError.response?.statusText || "Service Unavailable";
      const data = axiosError.response?.data || {
        message: "An unexpected error occurred",
      };

      return NextResponse.json(data, { status, statusText });
    }

    // Handle generic errors with similar structure
    const genericError = error as Record<string, unknown>;
    const status = (genericError.status || 500) as number;
    const message = genericError.message || "An unexpected error occurred";

    return NextResponse.json({ message }, { status });
  }

  // Handle cases where error is a primitive (e.g., string or number)
  return NextResponse.json(
    {
      message:
        typeof error === "string" ? error : "An unexpected error occurred",
    },
    { status: 500 }
  );
};

export const getServerAxiosWithToken = async () => {
  const token = await auth();
  const axios = customAxios;
  if (token?.accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${token?.accessToken}`;
  }
  return axios;
};
