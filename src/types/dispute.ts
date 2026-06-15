import { UmojaLinnCurrency, UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";

export const DISPUTE_REASONS = [
  {
    value: "UNABLE_TO_COMPLETE",
    label: "Unable to complete the work",
  },
  {
    value: "DELAY_TIMELINE_ISSUES",
    label: "Delay / timeline issues",
  },
  {
    value: "CLIENT_CHANGES_OUTSIDE_SCOPE",
    label: "Client requesting changes outside scope",
  },
  { value: "OTHER", label: "Other" },
] as const;

export type TDisputeReason = (typeof DISPUTE_REASONS)[number]["value"];

export type TDesignerDisputeType =
  | "DESIGNER_CANCELLATION_REQUEST"
  | "DESIGNER_REFUND";

export type TDisputeApiType =
  | "BUYER_ISSUE"
  | "DESIGNER_CANCELLATION_REQUEST"
  | "DESIGNER_REFUND";

export type TDisputeStatus = "IN_REVIEW" | "RESOLVED";

export type TDisputeResolution =
  | "PARTIAL_REFUND"
  | "FULL_REFUND"
  | "APPROVE_CANCELLATION"
  | "NO_REFUND";

export type TPreferredResolution =
  | "FULL_REFUND"
  | "PARTIAL_REFUND"
  | "NO_REFUND";

export type TCreateDesignerDisputePayload = {
  type: TDesignerDisputeType;
  milestoneId: string;
  reasonCategory: string;
  reasonDetail: string;
  requestedRefundAmount: number;
  attachments?: FileList | null;
};

export type TRespondToDisputePayload = {
  message: string;
  preferredResolution: TPreferredResolution;
  preferredRefundAmount?: number;
  attachments?: FileList | null;
};

export type TSubmitRefundRepaymentPayload = {
  amountPaid: number;
  receipt: File;
};

export interface IWalletDisputeCurrencySummary {
  locked: number;
  restricted: boolean;
  insufficientAmount: number;
}

export type IWalletDisputeSummary = Record<
  UmojaLinnCurrency,
  IWalletDisputeCurrencySummary
>;

export interface IUmojaLinnDisputeAttachment {
  id: string;
  url?: string;
}

export interface IUmojaLinnDisputeEvent {
  id: string;
  disputeId: string;
  actorType: string;
  actorUserId: string | null;
  actorAdminId: string | null;
  eventType: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUmojaLinnDisputeResponse {
  id: string;
  disputeId: string;
  responderUserId: string;
  responderType: string;
  message: string;
  preferredResolution: TPreferredResolution;
  preferredRefundAmount: string | number | null;
  attachments: IUmojaLinnDisputeAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface IUmojaLinnDispute {
  id: string;
  disputeId: string;
  type: TDisputeApiType;
  status: TDisputeStatus;
  resolution?: TDisputeResolution | null;
  fundLocation?: string | null;
  currency: UmojaLinnCurrency;
  projectId: string;
  milestoneId: string;
  initiatorUserId: string;
  respondentUserId: string;
  reasonCategory?: string | null;
  reasonDetail?: string | null;
  requestedRefundAmount?: string | number | null;
  approvedRefundAmount?: string | number | null;
  escrowAmount?: string | number | null;
  autoResolveAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Partial<UmojaLinnProject> | null;
  milestone?: Partial<UmojaLinnMilestone> | null;
  events?: IUmojaLinnDisputeEvent[];
  attachments?: IUmojaLinnDisputeAttachment[];
  responses?: IUmojaLinnDisputeResponse[];
  repaymentRequests?: unknown[];
}
