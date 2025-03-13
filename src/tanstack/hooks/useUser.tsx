import {
  changePassword,
  deleteProjectInvitationById,
  getMe,
  getNotificationSettings,
  onboard,
  updateNotificationSettings,
  updateUserDetails,
} from "@/actions/user";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { UmojaLinnNotification, UmojaLinnUser } from "@/types/user";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ME, NOTIFICATION, USER } from "../keys";
import { getNotifications, markNotificationAsRead } from "@/actions/project";
import useHandleError from "@/hooks/useHandleError";
import { NotificationSettingsProps, PasswordUpdateProps } from "@/types/form";

export const useGetMe = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnUser>>,
) => {
  const { data: me } = useSession();
  const path = usePathname();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [USER, ME],
    queryFn: () => getMe(),
    throwOnError(error: unknown) {
      if (
        axios.isAxiosError(error) &&
        [400, 401].includes(error?.status || 0)
      ) {
        queryClient.clear();
        signOut({
          callbackUrl: `/login?redirectTo=${path}`,
          redirect: true,
        });
      }
      return false;
    },
  });
};

export const useOnboard = (
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  return useMutation({
    ...options,
    mutationFn: onboard,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USER, ME] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useMarkNotificationAsRead = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: markNotificationAsRead,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useGetNotifications = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnNotification>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [NOTIFICATION],
    queryFn: () => getNotifications(),
  });
};

export const useUpdateUserDetails = (
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Update User");
  return useMutation({
    ...options,
    mutationFn: updateUserDetails,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USER, ME] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUpdatePassword = (
  options?: GenericUseMutationProps<SingleApiResponse, PasswordUpdateProps>,
) => {
  const { handleError } = useHandleError("Update Password");
  return useMutation({
    ...options,
    mutationFn: changePassword,
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUpdateNotificationSettings = (
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Partial<NotificationSettingsProps>
  >,
) => {
  const { handleError } = useHandleError("Notification Settings");
  return useMutation({
    ...options,
    mutationFn: updateNotificationSettings,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USER, NOTIFICATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetNotificationSettings = (
  options?: GenericUseQueryProps<SingleApiResponse<NotificationSettingsProps>>,
) => {
  const { data: me } = useSession();

  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [USER, NOTIFICATION],
    queryFn: () => getNotificationSettings(),
  });
};

export const useDeleteProjectInvitation = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Delete Project Invite");
  return useMutation({
    ...options,
    mutationFn: (id) => deleteProjectInvitationById(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USER, ME] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};
