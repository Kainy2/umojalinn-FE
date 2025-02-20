import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { UmojaLinnUser } from "@/types/user";
import { ServerActionOption, SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";

export const getMe = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnUser>>>(
    "/user/details"
  );
};

export const onboard = async (body: FormData, options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/onboard",
    body
  );
};
