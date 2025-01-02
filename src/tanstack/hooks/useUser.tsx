import { getMe, onboard } from "@/actions/user";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { UmojaLinnUser } from "@/types/user";
import { SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const useGetMe = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnUser>>
) => {
  const { data: me } = useSession();
  const path = usePathname();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["USER", "ME"],
    queryFn: () => getMe(),
    throwOnError(error: unknown) {
      if (axios.isAxiosError(error) && [400, 401].includes(error.status || 0)) {
        queryClient.clear();
        signOut({
          callbackUrl: `/login?redirectTo=${path}`,
          redirect: true,
        });
      }
      return false;
    },
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
