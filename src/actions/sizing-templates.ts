import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { base62ToUuidSafe } from "@/lib/uuid";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnSizingTemplate,
} from "@/types/project";
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

export const getBuyerSizingTemplateById = async (
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

export const getDesignerSizingTemplateById = async (
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
  >(`/sizing-template/designer/${base62ToUuidSafe(id)}`);
};

export const requestChangeOnSizingTemplate = async (
  id: string,
  requestedChanges: Partial<
    Record<
      keyof (UmojaLinnMaleSizingTemplateProps &
        UmojaLinnFemaleSizingTemplateProps),
      string
    >
  >,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnSizingTemplate>>
  >(
    `/sizing-template/designer/${base62ToUuidSafe(id)}/request-change`,
    requestedChanges
  );
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

export const requestMeasurementPoints = async (
  projectId: string,
  requestedMeasurementPoints: string[],
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/request-measurement-points`,
    {
      projectId: base62ToUuidSafe(projectId),
      requestedMeasurementPoints,
    }
  );
};

export const requestMeasurementPointsOnBid = async (
  bidId: string,
  measurements: Partial<
    UmojaLinnMaleSizingTemplateProps & UmojaLinnFemaleSizingTemplateProps
  >,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/project/bid/${base62ToUuidSafe(bidId)}/request-measurement-points`,
    measurements
  );
};

export const getRequestedMeasurementPoints = async (
  projectId: string,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<string[]>>>(
    `/sizing-template/project/${base62ToUuidSafe(projectId)}/requested-points`
  );
};

export const submitMeasurementPoints = async (
  templateId: string,
  projectId: string,
  measurements: Partial<
    UmojaLinnMaleSizingTemplateProps & UmojaLinnFemaleSizingTemplateProps
  >,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/${base62ToUuidSafe(templateId)}/submit-measurement-points?projectId=${base62ToUuidSafe(projectId)}`,
    measurements
  );
};

export const saveMeasurementPoints = async (
  templateId: string,
  measurements: Partial<
    UmojaLinnMaleSizingTemplateProps & UmojaLinnFemaleSizingTemplateProps
  >,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/${base62ToUuidSafe(templateId)}/save-measurement-points`,
    measurements
  );
};

export const sendSizingTemplateReminder = async (
  templateId: string,
  projectId: string,
  reminderType: import("@/types/constants").SizingTemplateReminderType,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/sizing-template/${base62ToUuidSafe(templateId)}/send-reminder`,
    {
      projectId: base62ToUuidSafe(projectId),
      reminderType,
    }
  );
};

export const purchaseSizingTemplate = async (
  body: { currency: "NAIRA" | "EURO"; numberOfTemplates: number },
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse<{ checkoutUrl: string }>>>(
    `/sizing-template/purchase`,
    body
  );
};
