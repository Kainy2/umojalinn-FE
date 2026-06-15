import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { IUmojaLinnDispute } from "@/types/dispute";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<IUmojaLinnDispute>, unknown>
    >("/disputes/my");

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
