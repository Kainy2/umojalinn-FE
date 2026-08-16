import { clientAxios, getAxiosToBeUsed, getServerAxiosWithToken } from "@/lib/axios";
import { convertApiParams } from "@/lib/request";
import { base62ToUuidSafe } from "@/lib/uuid";
import type { TCompleteGuidedTourBody } from "@/constant/tour/@types";
import { NotificationSettingsProps, PasswordUpdateProps } from "@/types/form";
import { WorkHistoryEntry } from "@/types/project";
import { UmojaLinnUser, UmojaLinnUserRole } from "@/types/user";
import {
  ArrayApiResponse,
  ServerActionOption,
  SingleApiResponse,
} from "@/types/util";
import { AxiosResponse } from "axios";
import { TAppConfig } from "@/types/app-config";

export const getAppConfig = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<TAppConfig>>>(
    "/user/app-config",
  );
};

export const getMe = async (options?: ServerActionOption) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<unknown, AxiosResponse<SingleApiResponse<UmojaLinnUser>>>(
    "/user/details",
  );
};

export const onboard = async (body: FormData, options?: ServerActionOption) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction
  })

  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/onboard",
    body,
  );
};

export const updateUserDetails = async (
  body: FormData,
  options?: ServerActionOption,
) => {
  const axios = await getAxiosToBeUsed({
    body,
    isServerAction: options?.isServerAction
  })
  
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/update-user-profile",
    body,
  );
};

export const changePassword = async (
  body: PasswordUpdateProps,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/change-password",
    body,
  );
};

export const updateNotificationSettings = async (
  body: Partial<NotificationSettingsProps>,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/update-notification-setting",
    body,
  );
};

export const completeGuidedTour = async (
  body: TCompleteGuidedTourBody,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.put<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/complete-guided-tour",
    body,
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
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.get<
    unknown,
    AxiosResponse<ArrayApiResponse<WorkHistoryEntry>>
  >(`/user/reviews${convertApiParams(apiParams)}`);
};

export const deleteProjectInvitationById = async (
  id: string,
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.delete<unknown, AxiosResponse<SingleApiResponse>>(
    `/user/remove-project-invitation/${base62ToUuidSafe(id)}`,
  );
};

export const verifyWalletPassword = async (
  body: { email: string; password: string },
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    `/wallet/verify-access`,
    body,
  );
};

export const sendCallNotification = async (
  body: { receiverId: string; callId: string },
  options?: ServerActionOption,
) => {
  let axios = clientAxios;
  if (options?.isServerAction) {
    axios = await getServerAxiosWithToken();
  }
  return axios.post<unknown, AxiosResponse<SingleApiResponse>>(
    "/user/send-call-notification",
    body,
  );
};
