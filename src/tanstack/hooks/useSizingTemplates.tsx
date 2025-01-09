import {
  addSizingTemplateToProject,
  createSizingTemplate,
  deleteSizingTemplate,
  getSizingTemplateById,
  getSizingTemplates,
  postSizingTemplateLive,
  updateSizingTemplate,
} from "@/actions/sizing-templates";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import { UmojaLinnSizingTemplate } from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SIZING_TEMPLATE } from "../keys";
import { useSession } from "next-auth/react";

export const useCreateSizingTemplate = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnSizingTemplate>,
    Partial<UmojaLinnSizingTemplate>
  >
) => {
  const { handleError } = useHandleError("Create Sizing Template");
  return useMutation({
    ...options,
    mutationFn: createSizingTemplate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUpdateSizingTemplate = (
  id?: string,
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnSizingTemplate>,
    Partial<UmojaLinnSizingTemplate>
  >
) => {
  const { handleError } = useHandleError("Update Sizing Template");
  return useMutation({
    ...options,
    mutationFn: (variable) => updateSizingTemplate(id || "", variable),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetAllSizingTemplates = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnSizingTemplate>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [SIZING_TEMPLATE],
    queryFn: () => getSizingTemplates(),
  });
};

export const useGetSizingTemplateById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnSizingTemplate>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [SIZING_TEMPLATE, id],
    queryFn: () => getSizingTemplateById(id || ""),
  });
};

export const useDeleteSizingTemplate = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
  const { handleError } = useHandleError("Delete Sizing Template");
  return useMutation({
    ...options,
    mutationFn: deleteSizingTemplate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const usePostSizingTemplateLive = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
  const { handleError } = useHandleError("Post Sizing Template Live");
  return useMutation({
    ...options,
    mutationFn: postSizingTemplateLive,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAddSizingTemplateToProject = (
  options?: GenericUseMutationProps<
    SingleApiResponse,
    { sizingTemplateId: string; projectId: string }
  >
) => {
  const { handleError } = useHandleError("Add Sizing Template");
  return useMutation({
    ...options,
    mutationFn: (variables) =>
      addSizingTemplateToProject(
        variables.sizingTemplateId,
        variables.projectId
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};
