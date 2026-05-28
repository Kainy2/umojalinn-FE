import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { UmojaLinnDesignerProfile } from "@/types/user";
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
      AxiosResponse<SingleApiResponse<UmojaLinnDesignerProfile>, unknown>
    >(`/buyer/designer/${id}/profile`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
