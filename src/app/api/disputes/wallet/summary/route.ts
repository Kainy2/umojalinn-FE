import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { IWalletDisputeSummary } from "@/types/dispute";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<IWalletDisputeSummary>, unknown>
    >("/disputes/wallet/summary");

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
