import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ bidId: string }> }
) => {
  try {
    await setBearerToken(req);
    const body = await req.json();

    const bidId = (await params).bidId;
    const response = await customAxios.put<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/project/update-bid/${bidId}`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
