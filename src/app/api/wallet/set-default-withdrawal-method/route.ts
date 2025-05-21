import { ArrayApiResponse } from "@/types/util";
import { customAxios, handleAPIError, setBearerToken } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { UmojaLinnWithdrawalMethod } from "@/types/project";

export const POST = async (req: NextRequest) => {
	try {
		await setBearerToken(req);

		const body = await req.json();

		const response = await customAxios.post<
			unknown,
			AxiosResponse<ArrayApiResponse<UmojaLinnWithdrawalMethod>, unknown>
		>(`/wallet/set-default-withdrawal-method`, body);

		return NextResponse.json(response.data);
	} catch (error) {
		return handleAPIError(error);
	}
};
