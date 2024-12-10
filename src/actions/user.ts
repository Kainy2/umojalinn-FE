import { clientAxios } from "@/lib/axios";
import { UmojaLinnLoginResponse, UmojaLinnUserRole } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { AxiosResponse } from "axios";

export const getMe = () =>
  clientAxios.get<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
  >("/user/me");

export const onboard = (profileType: UmojaLinnUserRole) => {
  return clientAxios.post<
    unknown,
    AxiosResponse<SingleApiResponse<UmojaLinnLoginResponse>, unknown>
  >("/user/onboard", { profileType });
};
