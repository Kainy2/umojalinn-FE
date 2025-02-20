import { UmojaLinnLoginResponse } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, inviterTag, password } = await req.json();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
    >(`/auth/login`, {
      email,
      inviterTag,
      password,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
