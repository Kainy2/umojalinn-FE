import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { UmojaLinnSharedWork } from "@/types/project";
import { SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await setBearerToken(req);
    const id = (await params)?.id;

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSharedWork>>
    >(`/designer/shared-work/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await setBearerToken(req);
    const id = (await params)?.id;
    const body = await req.formData();

    const response = await customAxios.put<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSharedWork>>
    >(`/designer/shared-work/${id}`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await setBearerToken(req);
    const id = (await params)?.id;

    const response = await customAxios.delete<
      unknown,
      AxiosResponse<SingleApiResponse<unknown>>
    >(`/designer/shared-work/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
