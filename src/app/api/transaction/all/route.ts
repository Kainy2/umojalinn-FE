import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnTransaction } from "@/types/transaction";
import { handleQueryParams } from "@/lib/request";

export const GET = async (req: NextRequest) => {
	try {
		await setBearerToken(req);
		
		const response = await customAxios.get<
			unknown,
			AxiosResponse<ArrayApiResponse<UmojaLinnTransaction>, unknown>
		>(`/transaction/all ${handleQueryParams(req, true)}`);

		return NextResponse.json(response.data);
	} catch (error) {
		return handleAPIError(error);
	}
};
