import {
  addProjectReview,
  approveOrRejectMilestone,
  createWithdrawalMethod,
  deleteProjectById,
  fundMilestone,
  fundProject,
  getAllBuyerProjects,
  getAllDesignerProjects,
  getClothingTypes,
  getMilestoneById,
  getMilestoneSubmissions,
  getProjectById,
  getProjectMediaAndLinks,
  getProjectMilestones,
  getSpecialistTypes,
  getWallet,
  getWithdrawalMethods,
  inviteBuyer,
  postProjectLive,
  requestWithdrawal,
  submitMilestone,
  updateProjectById,
} from "@/actions/project";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  UmojaLinnMediaLink,
  UmojaLinnMilestone,
  UmojaLinnMilestoneSubmission,
  UmojaLinnProject,
  UmojaLinnProjectReview,
  UmojaLinnSpecialistType,
  UmojalinnWallet,
  UmojaLinnWithdrawalMethod,
} from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  BUYER,
  CLOTHING_TYPES,
  DESIGNER,
  MEDIA_AND_LINK,
  MILESTONE,
  PROJECT,
  SUBMISSION,
  WALLET,
  WITHDRAWAL_METHODS,
} from "../keys";
import { AxiosProgressEvent } from "axios";
import {
  CreateWithdrawalMethodPayload,
  RequestWithdrawalPayload,
} from "@/section/form/withdraw/WithdrawalAmount";
import { getUserReviews, UserReviewsApiProps } from "@/actions/user";

export const useInviteBuyer = (
  options: GenericUseMutationProps<SingleApiResponse, { emails: string[] }>,
) => {
  const { handleError } = useHandleError("Invitation");
  return useMutation({
    ...options,
    mutationFn: inviteBuyer,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["USER", "ME"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetProjectById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnProject>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, id],
    queryFn: () => getProjectById(id || ""),
  });
};

export const useUpdateProjectById = (
  id?: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Update Project");
  return useMutation({
    ...options,
    mutationFn: (variable) => updateProjectById(id || "", variable),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const usePostProjectLive = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Update Project");
  return useMutation({
    ...options,
    mutationFn: postProjectLive,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetClothingTypes = (
  options?: GenericUseQueryProps<
    SingleApiResponse<UmojaLinnProject["clothingTypes"]>
  >,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, CLOTHING_TYPES],
    queryFn: () => getClothingTypes(),
  });
};

export const useGetAllBuyerProject = (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    projectStatus:
      | UmojaLinnProject["status"]
      | Array<UmojaLinnProject["status"]>;
    projectType:
      | UmojaLinnProject["projectType"]
      | Array<UmojaLinnProject["projectType"]>;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!(me?.user?.profileRole === "BUYER") && options?.enabled !== false,
    queryKey: [PROJECT, BUYER, { apiParams }],
    queryFn: () => getAllBuyerProjects(apiParams),
  });
};

export const useGetAllDesignerProject = (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    projectStatus:
      | UmojaLinnProject["status"]
      | Array<UmojaLinnProject["status"]>;
    projectType:
      | UmojaLinnProject["projectType"]
      | Array<UmojaLinnProject["projectType"]>;
    hasBid?: boolean;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!(me?.user?.profileRole === "DESIGNER") && options?.enabled !== false,
    queryKey: [PROJECT, DESIGNER, { apiParams }],
    queryFn: () => getAllDesignerProjects(apiParams),
  });
};

export const useGetProjectMilestones = (
  projectId: string,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMilestone>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!projectId && !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, { projectId }],
    queryFn: () => getProjectMilestones(projectId),
  });
};

export const useFundProject = (
  id: string,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Fund Project");
  return useMutation({
    ...options,
    mutationFn: (variables) => fundProject(id, variables, onUploadProgress),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useFundMilestone = (
  id: string,
  onUploadProgress?: (event: AxiosProgressEvent) => void,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Fund Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => fundMilestone(id, variables, onUploadProgress),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetMilestoneById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnMilestone>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, id],
    queryFn: () => getMilestoneById(id || ""),
  });
};

export const useGetMilestoneSubmissions = (
  id?: string,
  options?: GenericUseQueryProps<
    ArrayApiResponse<UmojaLinnMilestoneSubmission>
  >,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, SUBMISSION, id],
    queryFn: () => getMilestoneSubmissions(id || ""),
  });
};

export const useGetProjectMediaAndlinks = (
  id?: string,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMediaLink>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MEDIA_AND_LINK, id],
    queryFn: () => getProjectMediaAndLinks(id || ""),
  });
};

export const useApproveOrRejectMilestone = (
  id: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Pick<UmojaLinnMilestoneSubmission, "status" | "rejectionReason">
  >,
) => {
  const { handleError } = useHandleError("Submit Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => approveOrRejectMilestone(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSubmitMilestone = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Submit Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => submitMilestone(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetWallet = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojalinnWallet>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET],
    queryFn: () => getWallet(),
  });
};

export const useGetWithdrawalMethods = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnWithdrawalMethod>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
    queryFn: () => getWithdrawalMethods(),
  });
};

export const useCreateWithdrawalMethod = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnWithdrawalMethod>,
    CreateWithdrawalMethodPayload
  >,
) => {
  const { handleError } = useHandleError("Create Withdrawal Method");
  return useMutation({
    ...options,
    mutationFn: (variables) => createWithdrawalMethod(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRequestWithdrawal = (
  options?: GenericUseMutationProps<
    SingleApiResponse,
    RequestWithdrawalPayload
  >,
) => {
  const { handleError } = useHandleError("Request Withdrawal");
  return useMutation({
    ...options,
    mutationFn: (variables) => requestWithdrawal(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useDeleteProject = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Delete Project");
  return useMutation({
    ...options,
    mutationFn: (id) => deleteProjectById(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAddProjectReview = (
  id: string = "",
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnProject>,
    FormData
  >,
) => {
  const { handleError } = useHandleError("Add Review");
  return useMutation({
    ...options,
    mutationFn: (variables) => addProjectReview(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetUserReviews = (
  apiParams: UserReviewsApiProps,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProjectReview>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: me?.user && apiParams && options?.enabled !== false,
    queryKey: [PROJECT, "REVIEWS", { apiParams }],
    queryFn: () => getUserReviews(apiParams),
  });
};

export const useGetSpecialistTypes = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnSpecialistType>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["SPECIALIST_TYPES"],
    queryFn: () => getSpecialistTypes(),
  });
};
