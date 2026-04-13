import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnSubmitBidResponse } from "@/types/project";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = (await params)?.id;

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSubmitBidResponse>, unknown>
    >(`/project/account-connection-status/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
