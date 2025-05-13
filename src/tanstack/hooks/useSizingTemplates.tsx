import {
  addSizingTemplateToProject,
  createSizingTemplate,
  deleteSizingTemplate,
  getBuyerSizingTemplateById,
  getDesignerSizingTemplateById,
  getDesignerSizingTemplates,
  getSizingTemplates,
  postSizingTemplateLive,
  requestChangeOnSizingTemplate,
  updateSizingTemplate,
} from "@/actions/sizing-templates";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnSizingTemplate,
} from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BID, PROJECT, SIZING_TEMPLATE } from "../keys";
import { useSession } from "next-auth/react";
import { requestSizingTemplateInProject } from "@/actions/project";
import { useParams } from "next/navigation";

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

export const useRequestChangeSizingTemplate = (
  id?: string,
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnSizingTemplate>,
    Partial<
      Record<
        keyof (UmojaLinnMaleSizingTemplateProps &
          UmojaLinnFemaleSizingTemplateProps),
        string
      >
    >
  >
) => {
  const { handleError } = useHandleError("Request Change in Sizing Template");
  return useMutation({
    ...options,
    mutationFn: (variables) =>
      requestChangeOnSizingTemplate(id || "", variables),
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
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    sizingTemplateStatus:
      | UmojaLinnSizingTemplate["status"]
      | Array<UmojaLinnSizingTemplate["status"]>;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnSizingTemplate>>
) => {
  const { data: me } = useSession();
  return useQuery({
		...options,
		enabled:
			!!me?.user &&
			me?.user?.profileRole === 'BUYER' &&
			options?.enabled !== false,
		queryKey: [SIZING_TEMPLATE, apiParams],
		queryFn: () => getSizingTemplates(apiParams),
  });
};

export const useGetAllDesignerSizingTemplates = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnSizingTemplate>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [SIZING_TEMPLATE, "DESIGNER"],
    queryFn: () => getDesignerSizingTemplates(),
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
    queryFn: () =>
      (me?.user?.profileRole === "BUYER"
        ? getBuyerSizingTemplateById
        : getDesignerSizingTemplateById)(id || ""),
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
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRequestSizingTemplateInProject = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
    const { id } = useParams<{ id: string }>();
    const { data: me } = useSession();
  const { handleError } = useHandleError("Request Sizing Template");
  const queryclient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: requestSizingTemplateInProject,
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
    onSuccess:(...args) => {
      queryclient.invalidateQueries({ queryKey: [BID, { id, role: me?.user?.profileRole }]});
      options?.onSuccess?.(...args);
    }
  });
};
