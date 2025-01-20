import {
  fundMilestone,
  fundProject,
  getAllBuyerProjects,
  getAllDesignerProjects,
  getClothingTypes,
  getProjectById,
  getProjectMilestones,
  inviteBuyer,
  postProjectLive,
  updateProjectById,
} from "@/actions/project";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { BUYER, CLOTHING_TYPES, DESIGNER, MILESTONE, PROJECT } from "../keys";
import { AxiosProgressEvent } from "axios";

export const useInviteBuyer = (
  options: GenericUseMutationProps<SingleApiResponse, { emails: string[] }>
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
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnProject>>
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
  options?: GenericUseMutationProps<SingleApiResponse, FormData>
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
  options?: GenericUseMutationProps<SingleApiResponse, string>
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
  >
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
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>
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
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>
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
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMilestone>>
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
  options?: GenericUseMutationProps<SingleApiResponse, FormData>
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
  options?: GenericUseMutationProps<SingleApiResponse, FormData>
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
