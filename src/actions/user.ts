import { clientAxios } from "@/lib/axios";
import { UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";

export const getMe = () =>
  clientAxios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnUser>>>(
    "/user/me"
  );

export const onboard = (body: FormData) => {
  return clientAxios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/onboard",
    body
  );
};
