import {
  UmojaLinnCurrency,
  UmojaLinnMilestone,
  UmojaLinnProject,
} from "@/types/project";

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

export type TMilestoneDisputeType =
  | "BUYER_ISSUE"
  | "DESIGNER_CANCELLATION_REQUEST";

export type TDesignerDisputeType =
  | "DESIGNER_CANCELLATION_REQUEST"
  | "DESIGNER_REFUND_REQUEST";

export type TDisputeApiType =
  | "BUYER_ISSUE"
  | "DESIGNER_CANCELLATION_REQUEST"
  | "DESIGNER_REFUND_REQUEST";

export type TDisputeStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "AWAITING_PSP_CONFIRMATION"
  | "RESOLVED";

export type TDisputeFundLocation = "ESCROW" | "WALLET" | "WITHDRAWN";

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
  milestoneIds: string[];
  reasonCategory: string;
  reasonDetail: string;
  requestedRefundAmount: number;
  attachmentFiles?: FileList | File[];
};

export type TCreateBuyerDisputePayload = {
  type: "BUYER_ISSUE";
  milestoneIds: string[];
  reasonCategory: string;
  reasonDetail: string;
  requestedRefundAmount?: number;
  attachmentFiles?: FileList | File[];
};

export type TRespondToDisputePayload = {
  message: string;
  preferredResolution: TPreferredResolution;
  preferredRefundAmount?: number;
  attachmentFiles?: FileList | File[];
  attachmentUrls?: string[];
};

export interface IDisputeResponseWalletCheck {
  insufficient: boolean;
  refundAmount: number;
  availableBalance: number;
  topUpRequired: number;
  currency: UmojaLinnCurrency;
}

export interface IDisputeRespondData {
  response: IUmojaLinnDisputeResponse;
  walletCheck: IDisputeResponseWalletCheck | null;
}

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

export interface IWalletDisputeProject {
  id: string;
  title: string;
  status: string;
}

export interface IWalletDispute {
  id: string;
  disputeId: string;
  status: TDisputeStatus;
  currency: UmojaLinnCurrency;
  fundLocation: TDisputeFundLocation;
  totalDisputed: number;
  walletLockedAmount: number;
  createdAt: string;
  project: IWalletDisputeProject;
}

export interface IUmojaLinnDisputeAttachment {
  id: string;
  disputeId?: string;
  url?: string;
  uploadedBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUmojaLinnDisputeUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IUmojaLinnDisputeMilestone {
  id: string;
  disputeId: string;
  milestoneId: string;
  escrowAmount: string;
  designerEarningsAmount: string;
  commissionAmount: string;
  lockAmount: string;
  fundLocation: TDisputeFundLocation;
  previousStatus: string;
  createdAt: string;
  updatedAt: string;
  milestone: Partial<UmojaLinnMilestone> | null;
}

export interface IUmojaLinnDispute {
  id: string;
  disputeId: string;
  type: TDisputeApiType;
  status: TDisputeStatus;
  isActive?: boolean;
  resolution?: TDisputeResolution | null;
  refundType?: string | null;
  fundLocation?: TDisputeFundLocation | null;
  currency: UmojaLinnCurrency;
  projectId: string;
  milestoneId?: string;
  initiatorUserId: string;
  respondentUserId: string;
  response?: [];
  assigneeAdminId?: string | null;
  walletId?: string | null;
  reasonCategory?: string | null;
  reasonDetail?: string | null;
  internalNotes?: string | null;
  externalNotes?: string | null;
  requestedRefundAmount?: string | number | null;
  approvedRefundAmount?: string | number | null;
  escrowAmount?: string | number | null;
  designerEarningsAmount?: string | number | null;
  commissionAmount?: string | number | null;
  lockAmount?: string | number | null;
  awaitingPspConfirmationSince?: string | null;
  pspProvider?: string | null;
  pspReference?: string | null;
  pspConfirmedAt?: string | null;
  autoResolveAt?: string | null;
  resolvedAt?: string | null;
  remind48hSentAt?: string | null;
  remind72hSentAt?: string | null;
  subsequentMilestoneActions?: unknown | null;
  createdAt: string;
  updatedAt: string;
  designerEarningsImpact?: number | null;
  commissionAmountImpact?: number | null;
  refundRequested?: number | null;
  refundApproved?: number | null;
  project?: Partial<UmojaLinnProject> | null;
  milestone?: Partial<UmojaLinnMilestone> | null;
  initiator?: IUmojaLinnDisputeUser | null;
  respondent?: IUmojaLinnDisputeUser | null;
  disputeMilestones?: IUmojaLinnDisputeMilestone[];
  events?: IUmojaLinnDisputeEvent[];
  activityTimeline?: IUmojaLinnDisputeEvent[];
  attachments?: IUmojaLinnDisputeAttachment[];
  responses?: IUmojaLinnDisputeResponse[];
  repaymentRequests?: unknown[];
}
