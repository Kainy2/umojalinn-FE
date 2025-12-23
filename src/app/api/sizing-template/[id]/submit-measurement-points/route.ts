import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = (await params)?.id;
    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const body = await req.json();

    const url = projectId
      ? `/sizing-template/${id}/submit-measurement-points?projectId=${projectId}`
      : `/sizing-template/${id}/submit-measurement-points`;

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse>
    >(url, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};

