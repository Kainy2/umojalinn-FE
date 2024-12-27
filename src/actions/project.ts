import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { UmojaLinnProject } from "@/types/project";

import { ServerActionOption, SingleApiResponse } from "@/types/util";
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
    `/project/${id}`
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
    `/project/update-project/${id}`,
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
    `/project/post-live/${id}`
  );
};
