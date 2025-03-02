import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { handleQueryParams } from "@/lib/request";
import { UmojaLinnProjectReview } from "@/types/project";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<UmojaLinnProjectReview>, unknown>
    >(`/user/reviews${handleQueryParams(req, true)}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
