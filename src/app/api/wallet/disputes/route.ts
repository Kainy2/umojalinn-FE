import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { IWalletDispute } from "@/types/dispute";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<IWalletDispute>, unknown>
    >("/wallet/disputes");

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
