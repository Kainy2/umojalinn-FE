import { clientAxios, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { NotificationSettingsProps, PasswordUpdateProps } from "@/types/form";
import { UmojaLinnProjectReview } from "@/types/project";
import { UmojaLinnUser, UmojaLinnUserRole } from "@/types/user";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
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

export const updateUserDetails = async (
  body: FormData,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/update-user-profile",
    body
  );
};

export const changePassword = async (
  body: PasswordUpdateProps,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/change-password",
    body
  );
};

export const updateNotificationSettings = async (
  body: Partial<NotificationSettingsProps>,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/update-notification-setting",
    body
  );
};

export const getNotificationSettings = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<SingleApiResponse<NotificationSettingsProps>>
  >("/user/notification-setting");
};

export type UserReviewsApiProps = { profileType: UmojaLinnUserRole } & Partial<{
  lastId: string;
  limit: number;
}>;

export const getUserReviews = async (
  apiParams: UserReviewsApiProps,
  options?: ServerActionOption
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<UmojaLinnProjectReview>>
  >(`/user/reviews${convertApiParams(apiParams)}`);
};
