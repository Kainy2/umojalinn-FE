import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { base62ToUuidSafe } from "@/lib/uuid";
import { UmojaLinnSizingTemplate } from "@/types/project";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";

export const createSizingTemplate = async (
  body?: Partial<UmojaLinnSizingTemplate>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>>
  >("/sizing-template/create", body);
};

export const updateSizingTemplate = async (
  id: string,
  body?: Partial<UmojaLinnSizingTemplate>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>>
  >(`/sizing-template/${id}/update`, body);
};

export const getSizingTemplates = async (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    sizingTemplateStatus:
      | UmojaLinnSizingTemplate["status"]
      | Array<UmojaLinnSizingTemplate["status"]>;
  }>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnSizingTemplate>>
  >(`/sizing-template/all${apiParams ? convertApiParams(apiParams) : ""}`);
};

export const getDesignerSizingTemplates = async (
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnSizingTemplate>>
  >(`/sizing-template/designer/all`);
};

export const getSizingTemplateById = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>>
  >(`/sizing-template/${base62ToUuidSafe(id)}`);
};

export const deleteSizingTemplate = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.delete<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/${base62ToUuidSafe(id)}/delete`
  );
};

export const postSizingTemplateLive = async (
  id: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>>
  >(`/sizing-template/${base62ToUuidSafe(id)}/post-live`);
};

export const addSizingTemplateToProject = async (
  sizingTemplateId: string,
  projectId: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/add-to-project`,
    {
      projectId: base62ToUuidSafe(projectId),
      sizingTemplateId: base62ToUuidSafe(sizingTemplateId),
    }
  );
};
