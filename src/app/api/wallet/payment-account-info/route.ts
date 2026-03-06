import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnPaymentAccountInfo } from "@/types/project";


export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<UmojaLinnPaymentAccountInfo>, unknown>
    >(`/wallet/payment-account-info`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
