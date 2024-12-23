import { getMe, onboard } from "@/actions/user";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetMe = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnUser>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
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
