import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnProject } from "@/types/project";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<
        SingleApiResponse<UmojaLinnProject["clothingTypes"]>,
        unknown
      >
    >(`/project/clothing-types`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
