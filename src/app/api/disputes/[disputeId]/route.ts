import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { IUmojaLinnDispute } from "@/types/dispute";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ disputeId: string }> },
) => {
  try {
    await setBearerToken(req);

    const disputeId = (await params)?.disputeId;

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<IUmojaLinnDispute>, unknown>
    >(`/disputes/${disputeId}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
