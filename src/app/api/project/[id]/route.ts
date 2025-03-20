import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnProject } from "@/types/project";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = (await params)?.id;

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnProject>, unknown>
    >(`/project/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    const id = (await params)?.id;

    const response = await customAxios.delete<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/project/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
