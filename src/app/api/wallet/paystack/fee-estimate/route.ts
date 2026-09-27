import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { TPaystackFeeEstimate } from "@/types/project";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const body = await req.json();

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<TPaystackFeeEstimate>>
    >(`/wallet/paystack/fee-estimate`, { data: body });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
