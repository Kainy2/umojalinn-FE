import {
  createDesignerDispute,
  getDisputeById,
  getMyDisputes,
  getWalletDisputeSummary,
  respondToDispute,
  submitRefundRepayment,
} from "@/actions/dispute";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  IUmojaLinnDispute,
  IWalletDisputeSummary,
  TCreateDesignerDisputePayload,
} from "@/types/dispute";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { DISPUTES, PROJECT, WALLET } from "../keys";

export const useCreateDesignerDispute = (
  options?: GenericUseMutationProps<
    SingleApiResponse<IUmojaLinnDispute>,
    TCreateDesignerDisputePayload
  >,
) => {
  const { handleError } = useHandleError("Dispute request");
  return useMutation({
    ...options,
    mutationFn: (variables) => createDesignerDispute(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [DISPUTES] });
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRespondToDispute = (
  disputeId: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Dispute response");
  return useMutation({
    ...options,
    mutationFn: (variables) => respondToDispute(disputeId, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [DISPUTES] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, disputeId] });
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetDisputeById = (
  disputeId: string,
  options?: GenericUseQueryProps<SingleApiResponse<IUmojaLinnDispute>>,
) => {
  return useQuery({
    ...options,
    queryKey: [DISPUTES, disputeId],
    queryFn: () => getDisputeById(disputeId),
  });
};

export const useSubmitRefundRepayment = (
  disputeId: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>,
) => {
  const { handleError } = useHandleError("Refund repayment");
  return useMutation({
    ...options,
    mutationFn: (variables) => submitRefundRepayment(disputeId, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [DISPUTES] });
      queryClient.invalidateQueries({ queryKey: [WALLET] });
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetMyDisputes = (
  options?: GenericUseQueryProps<ArrayApiResponse<IUmojaLinnDispute>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [DISPUTES, "my"],
    queryFn: () => getMyDisputes(),
  });
};

export const useGetWalletDisputeSummary = (
  options?: GenericUseQueryProps<SingleApiResponse<IWalletDisputeSummary>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [DISPUTES, WALLET, "summary"],
    queryFn: () => getWalletDisputeSummary(),
  });
};
