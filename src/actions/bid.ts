import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import {
  UmojaLinnBid,
  UmojaLinnDeliveryMethod,
  UmojaLinnMilestone,
} from "@/types/project";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";

export const createBid = async (
  projectId: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse<UmojaLinnBid>>>(
    `/project/bid/${projectId}/create`
  );
};

export const getDesignerBids = async (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    bidStatus: UmojaLinnBid["status"];
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<ArrayApiResponse<UmojaLinnBid>>>(
    `/project/all/designer/bids${apiParams ? convertApiParams(apiParams) : ""}`
  );
};

export const getBuyerBids = async (
  apiParams?: Partial<{
    lastId: string;
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<ArrayApiResponse<UmojaLinnBid>>>(
    `/project/buyer/bids${apiParams ? convertApiParams(apiParams) : ""}`
  );
};

export const getBidById = async (id?: string, options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnBid>>>(
    `/project/designer/bid/${id}`
  );
};

export const createMilestone = async (
  bidId: string,
  body: Pick<UmojaLinnMilestone, "title" | "amount" | "description">,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/add-milestone-to-bid/${bidId}`,
    body
  );
};

export const updateMilestone = async (
  id: string,
  body: Partial<Pick<UmojaLinnMilestone, "title" | "amount" | "description">>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/update-milestone/${id}`,
    body
  );
};

export const deleteMilestone = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.delete<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/update-milestone/${id}`
  );
};

export const updateBid = async (
  id: string,
  body: Partial<{
    additionalNote: string;
    deliveryMethod: UmojaLinnDeliveryMethod;
    deliveryAmount: number;
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/update-bid/${id}`,
    body
  );
};

export const submitBid = async (id: string, options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/submit-bid/${id}`
  );
};

export const acceptOrRejectBid = async (
  id: string,
  body: {
    status: "ACCEPTED" | "REJECTED";
    rejectionReason: string;
  },
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/accept-or-reject-bid/${id}`,
    body
  );
};
