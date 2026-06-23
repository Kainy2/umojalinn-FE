import {
  getAxiosToBeUsed,
  getServerAxiosWithToken,
  clientAxios,
} from "@/lib/axios";
import {
  buildCreateDisputeFormData,
  buildRespondToDisputeFormData,
} from "@/lib/dispute";
import { base62ToUuidSafe } from "@/lib/uuid";
import {
  IDisputeRespondData,
  IUmojaLinnDispute,
  IWalletDispute,
  IWalletDisputeSummary,
  TCreateBuyerDisputePayload,
  TCreateDesignerDisputePayload,
  TRespondToDisputePayload,
} from "@/types/dispute";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";

export const createBuyerDispute = async (
  body: TCreateBuyerDisputePayload,
  options?: ServerActionOption,
) => {
  const formData = buildCreateDisputeFormData(body);
  const axios = await getAxiosToBeUsed({
    body: formData,
    isServerAction: options?.isServerAction,
  });

  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<IUmojaLinnDispute>>
  >("/disputes/buyer", formData);
};

export const createDesignerDispute = async (
  body: TCreateDesignerDisputePayload,
  options?: ServerActionOption,
) => {
  const formData = buildCreateDisputeFormData(body);
  const axios = await getAxiosToBeUsed({
    body: formData,
    isServerAction: options?.isServerAction,
  });

  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<IUmojaLinnDispute>>
  >("/disputes/designer", formData);
};

export const respondToDispute = async (
  disputeId: string,
  body: TRespondToDisputePayload,
  options?: ServerActionOption,
) => {
  const formData = buildRespondToDisputeFormData(body);
  const axios = await getAxiosToBeUsed({
    body: formData,
    isServerAction: options?.isServerAction,
  });

  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<IDisputeRespondData>>
  >(`/disputes/${base62ToUuidSafe(disputeId)}/respond`, formData);
};

export const getDisputeById = async (
  disputeId: string,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }

  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<IUmojaLinnDispute>>
  >(`/disputes/${base62ToUuidSafe(disputeId)}`);
};

export const submitRefundRepayment = async (
  disputeId: string,
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction,
  });

  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/disputes/${base62ToUuidSafe(disputeId)}/refund-repayment`,
    body,
  );
};

export const getMyDisputes = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }

  return axios.get<unknown, AxiosResponse<ArrayApiResponse<IUmojaLinnDispute>>>(
    "/disputes/my",
  );
};

export const getProjectDisputes = async (
  projectId: string,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }

  return axios.get<unknown, AxiosResponse<ArrayApiResponse<IUmojaLinnDispute>>>(
    `/project/${base62ToUuidSafe(projectId)}/disputes`,
  );
};

export const getWalletDisputeSummary = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }

  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<IWalletDisputeSummary>>
  >("/disputes/wallet/summary");
};

export const getWalletDisputes = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }

  return axios.get<unknown, AxiosResponse<ArrayApiResponse<IWalletDispute>>>(
    "/wallet/disputes",
  );
};
