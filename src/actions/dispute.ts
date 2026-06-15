import { getAxiosToBeUsed, getServerAxiosWithToken, clientAxios } from "@/lib/axios";
import { base62ToUuidSafe } from "@/lib/uuid";
import { IUmojaLinnDispute, IWalletDisputeSummary } from "@/types/dispute";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";

export const createDesignerDispute = async (
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction,
  });

  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<IUmojaLinnDispute>>
  >("/disputes/designer", body);
};

export const respondToDispute = async (
  disputeId: string,
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction,
  });

  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/disputes/${base62ToUuidSafe(disputeId)}/respond`,
    body,
  );
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

  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<IUmojaLinnDispute>>
  >("/disputes/my");
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
