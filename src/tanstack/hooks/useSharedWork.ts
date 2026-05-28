import { createSharedWork } from "@/actions/sharedWork";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import { UmojaLinnSharedWork } from "@/types/project";
import { GenericUseMutationProps } from "@/types/tanstack";
import { SingleApiResponse } from "@/types/util";
import { useMutation } from "@tanstack/react-query";
import { SHARED_WORK } from "../keys";

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
