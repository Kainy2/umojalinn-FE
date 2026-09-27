import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/consultation/all`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const body = await req.json();

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/consultation`, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
