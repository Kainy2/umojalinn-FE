import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "./auth";
import { serverInstance } from "./rollbar";
import { ServerActionOption } from "@/types/util";
import { formDataHasFile } from "./utils";

export const clientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// This is to make api calls directly from the client, 
// bypassing api routes and hence, vercel serverless 
// functions as well. Token is set in
// useStrictClientAxios and used in SidebarLayout.
export const strictClientAxios = axios.create({
  ...clientAxios.defaults,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    customAxios.defaults.headers.common["x-forwarded-for"] = xForwardedFor;
  }
  
  const xForwardedPath = req.headers.get("x-forwarded-path");
  if (xForwardedPath) {
    customAxios.defaults.headers.common["x-forwarded-path"] = xForwardedPath;
  }


  return session;
};

export const handleAPIError = (error: unknown) => {
  console.error("API Error:", error);
  serverInstance.error(error as Error, JSON.stringify(error));

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
    const status = (genericError?.status || 500) as number;
    const message = genericError?.message || "An unexpected error occurred";

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

  // Forward client IP headers to the backend
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      
      const xForwardedFor = headersList.get("x-forwarded-for");
      if (xForwardedFor) {
        axios.defaults.headers.common["x-forwarded-for"] = xForwardedFor;
      }
      
      const xForwardedPath = headersList.get("x-forwarded-path");
      if (xForwardedPath) {
        axios.defaults.headers.common["x-forwarded-path"] = xForwardedPath;
      }
    } catch (e) {
      console.log(e, "ERROR >>>");
      // Ignore if headers() is not available (e.g. outside server context)
    }
  }

  return axios;
};


export const getAxiosToBeUsed = ({ body, isServerAction }: ServerActionOption) => {
  if (isServerAction) {
    return getServerAxiosWithToken();
  }
  if (body instanceof FormData && formDataHasFile(body)) {
    return strictClientAxios;
  }
  return clientAxios;
}