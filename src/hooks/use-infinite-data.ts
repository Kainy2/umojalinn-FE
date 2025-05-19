import { ArrayApiResponse } from "@/types/util";
import { InfiniteData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useMemo } from "react";

export const useInfiniteData = <T>(data:InfiniteData<AxiosResponse<ArrayApiResponse<T>>> | undefined) => {
	return useMemo(() => 
			data?.pages?.map((page) => page.data.data).flat(), [data]
		);
};