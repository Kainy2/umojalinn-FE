import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string }> }
) => {
  try {
    await setBearerToken(req);

    const bidId = (await params).bidId;
    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/project/buyer/bid/${bidId}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
