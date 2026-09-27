import {
  createSharedWork,
  deleteSharedWork,
  getSharedWorkById,
  getPreviousHires,
  updateSharedWork,
} from "@/actions/sharedWork";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import { UmojaLinnSharedWork } from "@/types/project";
import { UmojaLinnPreviousHire } from "@/types/user";
import { GenericUseMutationProps, GenericUseQueryProps } from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BUYER, DESIGNER_PROFILE, SHARED_WORK } from "../keys";

export const useCreateSharedWork = (
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnSharedWork>, FormData>,
) => {
  const { handleError } = useHandleError("Share Your Work");
  return useMutation({
    ...options,
    mutationFn: (variables) => createSharedWork(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SHARED_WORK] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetSharedWorkById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnSharedWork>>,
) => {
  return useQuery({
    ...options,
    enabled: !!id && options?.enabled !== false,
    queryKey: [SHARED_WORK, id],
    queryFn: () => getSharedWorkById(id!),
  });
};

export const useUpdateSharedWork = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnSharedWork>,
    { id: string; body: FormData }
  >,
) => {
  const { handleError } = useHandleError("Update Work");
  return useMutation({
    ...options,
    mutationFn: ({ id, body }) => updateSharedWork(id, body),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SHARED_WORK] });
      queryClient.invalidateQueries({ queryKey: [DESIGNER_PROFILE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useDeleteSharedWork = (
  options?: GenericUseMutationProps<SingleApiResponse<unknown>, string>,
) => {
  const { handleError } = useHandleError("Delete Work");
  return useMutation({
    ...options,
    mutationFn: (id) => deleteSharedWork(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [SHARED_WORK] });
      queryClient.invalidateQueries({ queryKey: [DESIGNER_PROFILE] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetPreviousHires = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnPreviousHire>>,
) => {
  return useQuery({
    ...options,
    queryKey: [BUYER, "PREVIOUS_HIRES"],
    queryFn: () => getPreviousHires(),
  });
};
