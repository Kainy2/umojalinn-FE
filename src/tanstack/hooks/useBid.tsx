import {
  acceptOrRejectBid,
  createBid,
  createMilestone,
  deleteMilestone,
  getBidById,
  getBuyerBids,
  getDesignerBids,
  submitBid,
  updateBid,
  updateMilestone,
} from "@/actions/bid";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  UmojaLinnBid,
  UmojaLinnDeliveryMethod,
  UmojaLinnMilestone,
} from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useCreateBid = (
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnBid>, string>
) => {
  const { handleError } = useHandleError("Create Bid");
  return useMutation({
    ...options,
    mutationFn: createBid,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetDesigerBids = (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    bidStatus: UmojaLinnBid["status"];
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnBid>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["BID", "DESIGNER", apiParams],
    queryFn: () => getDesignerBids(apiParams),
  });
};

export const useGetBuyerBids = (
  apiParams?: Partial<{
    lastId: string;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnBid>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["BID", "BUYER", apiParams],
    queryFn: () => getBuyerBids(apiParams),
  });
};

export const useGetBidById = (
  id: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnBid>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["BID", { id }],
    queryFn: () => getBidById(id),
  });
};

export const useCreateMilestone = (
  bidId: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Pick<UmojaLinnMilestone, "title" | "amount" | "description">
  >
) => {
  const { handleError } = useHandleError("Create Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => createMilestone(bidId, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUpdateMilestone = (
  id: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Partial<Pick<UmojaLinnMilestone, "title" | "amount" | "description">>
  >
) => {
  const { handleError } = useHandleError("Update Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => updateMilestone(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useDeleteMilestone = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
  const { handleError } = useHandleError("Delete Milestone");
  return useMutation({
    ...options,
    mutationFn: deleteMilestone,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUpdateBid = (
  id: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Partial<{
      additionalNote: string;
      deliveryMethod: UmojaLinnDeliveryMethod;
      deliveryAmount: number;
    }>
  >
) => {
  const { handleError } = useHandleError("Update Bid");
  return useMutation({
    ...options,
    mutationFn: (variables) => updateBid(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSubmitBid = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse>
) => {
  const { handleError } = useHandleError("Submit Bid");
  return useMutation({
    ...options,
    mutationFn: () => submitBid(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAcceptOrRejectBid = (
  id: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    {
      status: "ACCEPTED" | "REJECTED";
      rejectionReason: string;
    }
  >
) => {
  const { handleError } = useHandleError("Update Bid");
  return useMutation({
    ...options,
    mutationFn: (variables) => acceptOrRejectBid(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["BID"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};
