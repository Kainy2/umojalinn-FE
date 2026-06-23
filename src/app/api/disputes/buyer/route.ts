import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { IUmojaLinnDispute } from "@/types/dispute";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const body = await req.formData();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<IUmojaLinnDispute>, unknown>
    >("/disputes/buyer", body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
