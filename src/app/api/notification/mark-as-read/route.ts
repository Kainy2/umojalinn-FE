import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  // { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await setBearerToken(req);

    // const body = (await params)?.body;
    // const id = (await params)?.id;

    const body = await req.json();
    // const body = await req.formData();

    const response = await customAxios.put<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/notification/mark-as-read`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
