import { UmojaLinnLoginResponse } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const headersList = await headers();
    const hash = headersList.get("x-social-signature");

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
    >(`/auth/google-auth`, body, {
      headers: {
        "x-social-signature": hash,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
