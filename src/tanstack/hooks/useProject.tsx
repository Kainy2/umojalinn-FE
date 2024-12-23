import { inviteBuyer } from "@/actions/project";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import { GenericUseMutationProps } from "@/types/tanstack";
import { SingleApiResponse } from "@/types/util";
import { useMutation } from "@tanstack/react-query";

export const useInviteBuyer = (
  options: GenericUseMutationProps<SingleApiResponse, { email: string[] }>
) => {
  const { handleError } = useHandleError("Invite");
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
