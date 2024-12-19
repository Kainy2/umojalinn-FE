import { getMe, onboard } from "@/actions/user";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMe = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnUser>>
) => {
  return useQuery({
    ...options,
    queryKey: ["USER", "ME"],
    queryFn: () => getMe(),
  });
};

export const useOnboard = (
  options: GenericUseMutationProps<SingleApiResponse, FormData>
) => {
  return useMutation({
    ...options,
    mutationFn: onboard,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["USER", "ME"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
