import { TDisputeReason } from "@/types/dispute";
import { UmojaLinnCurrency } from "@/types/project";

export type TDisputeStatus = "IN_REVIEW" | "RESOLVED";

export type TDisputeType =
  | "BUYER_ISSUE"
  | "DESIGNER_CANCELLATION"
  | "DESIGNER_REFUND";

export type TDisputeMilestoneTag = "DISPUTED" | "REFUNDED";

export type TDisputeResolutionPreference = "FULL" | "PARTIAL" | "NONE";

export interface IDisputeAttachment {
  id: string;
  url?: string;
}

export interface IDisputeRelatedMilestone {
  milestoneId: string;
  label: string;
  amount: number;
  tag: TDisputeMilestoneTag;
}

export type TDisputeActivityType =
  | "DISPUTE_RAISED"
  | "BUYER_RESPONSE"
  | "OUTCOME";

export interface IDisputeActivity {
  id: string;
  type: TDisputeActivityType;
  date: string;
  title: string;
  expandable?: boolean;
  body?: string;
  outcomeDetails?: {
    refundedAmount?: number;
    reason?: string;
    paymentNote?: string;
  };
}

export interface IProjectDispute {
  id: string;
  type: TDisputeType;
  status: TDisputeStatus;
  createdAt: string;
  reason?: TDisputeReason;
  reasonLabel?: string;
  description?: string;
  attachments?: IDisputeAttachment[];
  relatedMilestones?: IDisputeRelatedMilestone[];
  activities?: IDisputeActivity[];
  requiresResponse?: boolean;
  responseDeadline?: string;
  summaryDocUrl?: string;
  fullRefundAmount?: number;
}

export interface IProjectDisputesProps {
  projectId: string;
  currency?: UmojaLinnCurrency | null;
}

export interface IDisputeListItemProps {
  dispute: IProjectDispute;
  currency?: UmojaLinnCurrency | null;
  expanded: boolean;
  isResponding: boolean;
  onToggleExpand: () => void;
  onRespondNow: () => void;
  onCancelResponse: () => void;
  onResponseSuccess: () => void;
}

export interface IDisputeActionBannerProps {
  responseDeadline?: string;
  onRespondNow: () => void;
}

export interface IDisputeResponseFormProps {
  disputeId: string;
  currency?: UmojaLinnCurrency | null;
  fullRefundAmount?: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export interface IDisputeResolvedContentProps {
  dispute: IProjectDispute;
  currency?: UmojaLinnCurrency | null;
}

export interface IDisputeActivitiesProps {
  activities?: IDisputeActivity[];
  currency?: UmojaLinnCurrency | null;
}

export interface IDisputeStatusBadgeProps {
  status: TDisputeStatus;
}
