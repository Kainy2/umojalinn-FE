import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { UmojaLinnPreviousHire } from "@/types/user";
import { ArrayApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<ArrayApiResponse<UmojaLinnPreviousHire>>
    >(`/buyer/previous-hires`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
