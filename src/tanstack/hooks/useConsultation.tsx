/* eslint-disable @typescript-eslint/no-unused-vars */
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  AVAILABILITY,
  BUYER,
  CONSULTATION,
  DESIGNER,
} from "@/tanstack/keys";
import {
  ConsultationBuyerFilter,
  ConsultationDesignerFilter,
  TBookConsultationPayload,
  TCreateConsultationRequestPayload,
  TReschedulePayload,
  TSaveAvailabilityPayload,
  TSubmitSummaryPayload,
  TSuggestConsultationPayload,
  UmojaLinnAvailableTimeslot,
  UmojaLinnConsultation,
  UmojaLinnConsultationAvailability,
} from "@/types/consultation";
import { GenericUseMutationProps, GenericUseQueryProps } from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import {
  MOCK_AVAILABLE_TIMESLOTS,
  MOCK_BUYER_CONSULTATIONS,
  MOCK_DESIGNER_AVAILABILITY,
  MOCK_DESIGNER_CONSULTATIONS,
} from "@/lib/consultation-mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockDelay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

const mockQueryResponse = <T,>(data: T): AxiosResponse<SingleApiResponse<T>> =>
  ({
    data: { data, message: "Success", status: 200 },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as never,
  }) as AxiosResponse<SingleApiResponse<T>>;

const mockArrayResponse = <T,>(
  items: T[],
): AxiosResponse<ArrayApiResponse<T>> =>
  ({
    data: { data: items, message: "Success", status: 200, total: items.length },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as never,
  }) as AxiosResponse<ArrayApiResponse<T>>;

// ─── Query hooks ─────────────────────────────────────────────────────────────

export const useGetBuyerConsultations = (
  filter?: ConsultationBuyerFilter,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnConsultation>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!(me?.user?.profileRole === "BUYER") && options?.enabled !== false,
    queryKey: [CONSULTATION, BUYER, { filter }],
    queryFn: async () => {
      await mockDelay();
      const filtered =
        !filter || filter === "ALL"
          ? MOCK_BUYER_CONSULTATIONS
          : MOCK_BUYER_CONSULTATIONS.filter(
              (c) => c.buyerStatus === filter,
            );
      return mockArrayResponse(filtered);
    },
  });
};

export const useGetDesignerConsultations = (
  filter?: ConsultationDesignerFilter,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnConsultation>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!(me?.user?.profileRole === "DESIGNER") && options?.enabled !== false,
    queryKey: [CONSULTATION, DESIGNER, { filter }],
    queryFn: async () => {
      await mockDelay();
      const filtered =
        !filter || filter === "ALL"
          ? MOCK_DESIGNER_CONSULTATIONS
          : MOCK_DESIGNER_CONSULTATIONS.filter((c) => {
              if (filter === "ADD_SUMMARY")
                return c.designerStatus === "AWAITING_SUMMARY";
              return c.designerStatus === filter;
            });
      return mockArrayResponse(filtered);
    },
  });
};

export const useGetConsultationById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnConsultation>>,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [CONSULTATION, id],
    queryFn: async () => {
      await mockDelay();
      const consultation =
        MOCK_BUYER_CONSULTATIONS.find((c) => c.id === id) ??
        MOCK_BUYER_CONSULTATIONS[0];
      return mockQueryResponse(consultation);
    },
  });
};

export const useGetDesignerAvailability = (
  designerId?: string,
  options?: GenericUseQueryProps<
    SingleApiResponse<UmojaLinnConsultationAvailability>
  >,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!designerId && options?.enabled !== false,
    queryKey: [CONSULTATION, AVAILABILITY, designerId],
    queryFn: async () => {
      await mockDelay();
      return mockQueryResponse(MOCK_DESIGNER_AVAILABILITY);
    },
  });
};

export const useGetAvailableTimeslots = (
  designerId?: string,
  durationMins?: number,
  options?: GenericUseQueryProps<
    ArrayApiResponse<UmojaLinnAvailableTimeslot>
  >,
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!me?.user && !!designerId && !!durationMins && options?.enabled !== false,
    queryKey: [CONSULTATION, AVAILABILITY, designerId, "slots", durationMins],
    queryFn: async () => {
      await mockDelay();
      return mockArrayResponse(MOCK_AVAILABLE_TIMESLOTS);
    },
  });
};

// ─── Mutation hooks ───────────────────────────────────────────────────────────

export const useCreateConsultationRequest = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    TCreateConsultationRequestPayload
  >,
) => {
  const { handleError } = useHandleError("Consultation Request");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TCreateConsultationRequestPayload) => {
      await mockDelay(600);
      return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[0]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION, BUYER] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useBookConsultation = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    TBookConsultationPayload
  >,
) => {
  const { handleError } = useHandleError("Book Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TBookConsultationPayload) => {
      await mockDelay(600);
      return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[3]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAcceptConsultation = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    string
  >,
) => {
  const { handleError } = useHandleError("Accept Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(MOCK_DESIGNER_CONSULTATIONS[0]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRejectConsultation = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Reject Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(undefined);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION, DESIGNER] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRescheduleConsultation = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    TReschedulePayload
  >,
) => {
  const { handleError } = useHandleError("Reschedule Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TReschedulePayload) => {
      await mockDelay(600);
      return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[4]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAcceptReschedule = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    string
  >,
) => {
  const { handleError } = useHandleError("Accept Reschedule");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[3]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useDeclineReschedule = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Decline Reschedule");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(undefined);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useCancelConsultation = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Cancel Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(600);
      return mockQueryResponse(undefined);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSubmitSummary = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    TSubmitSummaryPayload
  >,
) => {
  const { handleError } = useHandleError("Submit Summary");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TSubmitSummaryPayload) => {
      await mockDelay(700);
      return mockQueryResponse(MOCK_DESIGNER_CONSULTATIONS[9]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAcceptSummary = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    string
  >,
) => {
  const { handleError } = useHandleError("Accept Summary");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[10]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRejectSummary = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Reject Summary");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(undefined);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useReportMissing = (
  options?: GenericUseMutationProps<SingleApiResponse, string>,
) => {
  const { handleError } = useHandleError("Report Missing");
  return useMutation({
    ...options,
    mutationFn: async (_id: string) => {
      await mockDelay(500);
      return mockQueryResponse(undefined);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSaveDesignerAvailability = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultationAvailability>,
    TSaveAvailabilityPayload
  >,
) => {
  const { handleError } = useHandleError("Save Availability");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TSaveAvailabilityPayload) => {
      await mockDelay(600);
      return mockQueryResponse(MOCK_DESIGNER_AVAILABILITY);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION, AVAILABILITY] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSuggestConsultation = (
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnConsultation>,
    TSuggestConsultationPayload
  >,
) => {
  const { handleError } = useHandleError("Suggest Consultation");
  return useMutation({
    ...options,
    mutationFn: async (_payload: TSuggestConsultationPayload) => {
      await mockDelay(600);
      return mockQueryResponse(MOCK_DESIGNER_CONSULTATIONS[2]);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [CONSULTATION, DESIGNER] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};
