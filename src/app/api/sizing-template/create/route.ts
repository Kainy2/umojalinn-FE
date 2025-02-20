import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnSizingTemplate } from "@/types/project";

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const body = await req.json();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>, unknown>
    >(`/sizing-template/create`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
