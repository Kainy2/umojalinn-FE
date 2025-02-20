import { UmojaLinnLoginResponse } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { firstName, lastName, email, inviterTag, password } = await (
      req as unknown as NextRequest
    ).json();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
    >(`/auth/create-account`, {
      firstName,
      lastName,
      email,
      inviterTag,
      password,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
