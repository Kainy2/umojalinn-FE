import { UmojaLinnUserRole } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const { profileType } = (await (req as unknown as NextRequest).json()) as {
      profileType: UmojaLinnUserRole;
    };

    const response = await customAxios.post<
      unknown,
      AxiosResponse<SingleApiResponse, unknown>
    >(`/user/onboard`, { profileType });

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
