import { SingleApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnSpecialistType } from "@/types/project";

export const GET = async (req: NextRequest) => {
  try {
    await setBearerToken(req);

    const response = await customAxios.get<
      unknown,
      AxiosResponse<SingleApiResponse<UmojaLinnSpecialistType>, unknown>
    >(`/project/specialist-types`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleAPIError(error);
  }
};
