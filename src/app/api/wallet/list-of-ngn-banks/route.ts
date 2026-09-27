import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnNgnBank } from "@/types/project";


export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<UmojaLinnNgnBank>, unknown>
    >(`/wallet/list-of-ngn-banks`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
