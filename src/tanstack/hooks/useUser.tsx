import { getMe, onboard } from "@/actions/user";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";

const getMeConfig = {
  queryKey: ["USER", "ME"],
  queryFn: getMe,
};

export const useGetMe = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnUser>>
) => {
  return useQuery({ ...options, ...getMeConfig });
};

export const prefetchGetMe = () => {
  return queryClient.prefetchQuery({
    ...getMeConfig,
    staleTime: 10 * 1000, // only prefetch if older than 10 seconds
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
