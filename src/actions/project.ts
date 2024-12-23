import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { UmojaLinnProject } from "@/types/project";

import { ServerActionOption, SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";

export const inviteBuyer = async (
  body: { email: string[] },
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

export const createPrivateProject = async (
  body?: { tag?: string },
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnProject>>
  >("/project/create-private-project", body);
};
