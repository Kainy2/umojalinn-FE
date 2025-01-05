import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { base62ToUuidSafe } from "@/lib/uuid";
import { UmojaLinnProject } from "@/types/project";

import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";

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
  body?: { tag?: string; projectType: UmojaLinnProject["projectType"] },
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
    bidStatus: UmojaLinnProject["status"];
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
    bidStatus: UmojaLinnProject["status"];
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
