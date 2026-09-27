import { getAxiosToBeUsed } from "@/lib/axios";
import { UmojaLinnSharedWork } from "@/types/project";
import { UmojaLinnPreviousHire } from "@/types/user";
import { ArrayApiResponse, ServerActionOption, SingleApiResponse } from "@/types/util";
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

export const getSharedWorkById = async (
  id: string,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    isServerAction: options?.isServerAction,
  });

  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnSharedWork>>>(
    `/designer/shared-work/${id}`,
  );
};

export const updateSharedWork = async (
  id: string,
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction,
  });

  return axios.put<unknown, AxiosResponse<SingleApiResponse<UmojaLinnSharedWork>>>(
    `/designer/shared-work/${id}`,
    body,
  );
};

export const deleteSharedWork = async (
  id: string,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    isServerAction: options?.isServerAction,
  });

  return axios.delete<unknown, AxiosResponse<SingleApiResponse<unknown>>>(
    `/designer/shared-work/${id}`,
  );
};

export const getPreviousHires = async (
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    isServerAction: options?.isServerAction,
  });

  return axios.get<unknown, AxiosResponse<ArrayApiResponse<UmojaLinnPreviousHire>>>(
    `/buyer/previous-hires`,
  );
};
