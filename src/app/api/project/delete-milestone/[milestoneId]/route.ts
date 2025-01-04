import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) => {
  try {
    await setBearerToken(req);
    const body = await req.json();

    const milestoneId = (await params).milestoneId;
    const response = await customAxios.delete<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/project/delete-milestone/${milestoneId}`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
