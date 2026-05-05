import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { base62ToUuidSafe } from "@/lib/uuid";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnSizingTemplate } from "@/types/project";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = base62ToUuidSafe((await params)?.id ?? "");

    const body = await req.json();

    const response = await customAxios.put<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>, unknown>
    >(`/sizing-template/${id}/update`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
