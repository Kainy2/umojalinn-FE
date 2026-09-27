import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ disputeId: string }> },
) => {
  try {
    await setBearerToken(req);

    const disputeId = (await params)?.disputeId;
    const body = await req.formData();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/disputes/${disputeId}/refund-repayment`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
