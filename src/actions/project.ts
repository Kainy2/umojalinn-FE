import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { base62ToUuidSafe } from "@/lib/uuid";
import {
  CreateWithdrawalMethodPayload,
  RequestWithdrawalPayload,
} from "@/section/form/withdraw/WithdrawalAmount";
import {
  UmojaLinnMediaLink,
  UmojaLinnMilestone,
  UmojaLinnMilestoneSubmission,
  UmojaLinnProject,
  UmojalinnWallet,
  UmojaLinnWithdrawalMethod,
} from "@/types/project";

import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosProgressEvent, AxiosResponse } from "axios";

export const inviteBuyer = async (
  body: { emails: string[] },
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/project/invite-buyer",
    body
  );
};

export const createProject = async (
  body?: {
    tag?: string;
    projectType: UmojaLinnProject["projectType"];
  },
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnProject>>
  >("/project/create-project", body);
};

export const getProjectById = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnProject>>>(
    `/project/${base62ToUuidSafe(id)}`
  );
};

export const getClothingTypes = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnProject["clothingTypes"]>>
  >(`/project/clothing-types`);
};

export const updateProjectById = async (
  id: string,
  body: FormData,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/update-project/${base62ToUuidSafe(id)}`,
    body
  );
};

export const postProjectLive = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/post-live/${base62ToUuidSafe(id)}`
  );
};

export const getAllBuyerProjects = async (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    bidStatus: UmojaLinnProject["status"] | Array<UmojaLinnProject["status"]>;
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<ArrayApiResponse<UmojaLinnProject>>>(
    `/project/all/buyer${apiParams ? convertApiParams(apiParams) : ""}`
  );
};

export const getAllDesignerProjects = async (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    bidStatus: UmojaLinnProject["status"] | Array<UmojaLinnProject["status"]>;
    hasBid?: boolean;
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<ArrayApiResponse<UmojaLinnProject>>>(
    `/project/all/designer${apiParams ? convertApiParams(apiParams) : ""}`
  );
};

export const requestSizingTemplateInProject = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/request-sizing-template/${base62ToUuidSafe(id)}`
  );
};

export const getProjectMilestones = async (
  projectId: string,
  apiParams?: Record<string, unknown>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnMilestone>>
  >(
    `/project/${base62ToUuidSafe(projectId)}/milestones${
      apiParams ? convertApiParams(apiParams) : ""
    }`
  );
};

export const fundProject = async (
  id: string,
  body: FormData,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
  apiParams?: Record<string, unknown>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/fund-project/${base62ToUuidSafe(id)}${
      apiParams ? convertApiParams(apiParams) : ""
    }`,
    body,
    {
      onUploadProgress,
    }
  );
};

export const fundMilestone = async (
  id: string,
  body: FormData,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
  apiParams?: Record<string, unknown>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/fund-milestone/${base62ToUuidSafe(id)}${
      apiParams ? convertApiParams(apiParams) : ""
    }`,
    body,
    {
      onUploadProgress,
    }
  );
};

export const getMilestoneById = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnMilestone>>
  >(`/project/milestone/${base62ToUuidSafe(id)}`);
};

export const getMilestoneSubmissions = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnMilestoneSubmission>>
  >(`/project/milestone/submissions/${base62ToUuidSafe(id)}`);
};

export const getProjectMediaAndLinks = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnMediaLink>>
  >(`/project/media-and-links/${base62ToUuidSafe(id)}`);
};

export const approveOrRejectMilestone = async (
  id: string,
  body: Pick<UmojaLinnMilestoneSubmission, "status" | "rejectionReason">,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/milestone/approve-or-reject/${base62ToUuidSafe(id)}`,
    body
  );
};

export const submitMilestone = async (
  id: string,
  body: FormData,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/milestone/submit/${base62ToUuidSafe(id)}`,
    body
  );
};

export const getWallet = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojalinnWallet>>>(
    `/wallet`
  );
};

export const getWithdrawalMethods = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnWithdrawalMethod>>
  >(`/wallet/withdrawal-methods`);
};

export const createWithdrawalMethod = async (
  body: CreateWithdrawalMethodPayload,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnWithdrawalMethod>>
  >(`/wallet/add-withdrawal-method`, body);
};

export const requestWithdrawal = async (
  body: RequestWithdrawalPayload,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/wallet/withdraw`,
    body
  );
};
