import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = (await params).id;

    const response = await customAxios.delete<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/sizing-template/${id}/delete`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
