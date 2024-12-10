import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { token } = await req.json();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/auth/verify-email`, {
      token,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
