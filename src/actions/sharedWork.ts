import { getAxiosToBeUsed } from "@/lib/axios";
import { UmojaLinnSharedWork } from "@/types/project";
import { ServerActionOption, SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";

export const createSharedWork = async (
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction,
  });

  return axios.post<unknown, AxiosResponse<SingleApiResponse<UmojaLinnSharedWork>>>(
    `/designer/shared-work`,
    body,
  );
};
