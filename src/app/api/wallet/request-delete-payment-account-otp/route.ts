import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/wallet/request-delete-payment-account-otp`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
