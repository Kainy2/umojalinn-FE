import {
  createBuyerDispute,
  createDesignerDispute,
  getDisputeById,
  getMyDisputes,
  getProjectDisputes,
  getWalletDisputeSummary,
  getWalletDisputes,
  respondToDispute,
  submitRefundRepayment,
} from "@/actions/dispute";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  IDisputeRespondData,
  IUmojaLinnDispute,
  IWalletDispute,
  IWalletDisputeSummary,
  TCreateBuyerDisputePayload,
  TCreateDesignerDisputePayload,
  TRespondToDisputePayload,
} from "@/types/dispute";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { DISPUTES, PROJECT, WALLET } from "../keys";

export const useCreateBuyerDispute = (
  options?: GenericUseMutationProps<
    SingleApiResponse<IUmojaLinnDispute>,
    TCreateBuyerDisputePayload
  >,
) => {
  const { handleError } = useHandleError("Dispute request");
  return useMutation({
    ...options,
    mutationFn: (variables) => createBuyerDispute(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [DISPUTES] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, "project"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "summary"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "disputes"] });
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

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
      queryClient.invalidateQueries({ queryKey: [DISPUTES, "project"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "summary"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "disputes"] });
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
  options?: GenericUseMutationProps<
    SingleApiResponse<IDisputeRespondData>,
    TRespondToDisputePayload
  >,
) => {
  const { handleError } = useHandleError("Dispute response");
  return useMutation({
    ...options,
    mutationFn: (variables) => respondToDispute(disputeId, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [DISPUTES] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, disputeId] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, "project"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "summary"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "disputes"] });
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
      queryClient.invalidateQueries({ queryKey: [DISPUTES, "project"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "summary"] });
      queryClient.invalidateQueries({ queryKey: [DISPUTES, WALLET, "disputes"] });
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

export const useGetProjectDisputes = (
  projectId: string,
  options?: GenericUseQueryProps<ArrayApiResponse<IUmojaLinnDispute>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!projectId && !!me?.user && options?.enabled !== false,
    queryKey: [DISPUTES, "project", projectId],
    queryFn: () => getProjectDisputes(projectId),
  });
};

export const useGetProjectDisputesWithDetails = (
  projectId: string,
  options?: GenericUseQueryProps<ArrayApiResponse<IUmojaLinnDispute>>,
) => {
  const listQuery = useGetProjectDisputes(projectId, options);
  const disputeIds = useMemo(
    () => listQuery.data?.data?.data?.map((dispute) => dispute.id) ?? [],
    [listQuery.data?.data?.data],
  );

  const detailQueries = useQueries({
    queries: disputeIds.map((disputeId) => ({
      queryKey: [DISPUTES, disputeId],
      queryFn: () => getDisputeById(disputeId),
      enabled: listQuery.isSuccess && !!disputeId,
    })),
  });

  const disputes = useMemo(() => {
    const list = listQuery.data?.data?.data ?? [];

    return list.map((dispute, index) => {
      const detail = detailQueries[index]?.data?.data?.data;
      return detail ? { ...dispute, ...detail } : dispute;
    });
  }, [detailQueries, listQuery.data?.data?.data]);

  const isLoadingDetails =
    disputeIds.length > 0 && detailQueries.some((query) => query.isLoading);

  const detailLoadingById = useMemo(() => {
    const loadingById: Record<string, boolean> = {};

    disputeIds.forEach((disputeId, index) => {
      loadingById[disputeId] = detailQueries[index]?.isLoading ?? false;
    });

    return loadingById;
  }, [detailQueries, disputeIds]);

  return {
    ...listQuery,
    disputes,
    isLoading: listQuery.isLoading,
    isLoadingDetails,
    detailLoadingById,
  };
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

export const useGetWalletDisputes = (
  options?: GenericUseQueryProps<ArrayApiResponse<IWalletDispute>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [DISPUTES, WALLET, "disputes"],
    queryFn: () => getWalletDisputes(),
  });
};
