import { IUmojaLinnDispute, TDisputeStatus } from "@/types/dispute";
import { UmojaLinnCurrency } from "@/types/project";

export type TDisputeResolutionPreference = "FULL" | "PARTIAL" | "NONE";

export interface IProjectDisputesProps {
  projectId: string;
  currency?: UmojaLinnCurrency | null;
}

export interface IDisputeListItemProps {
  dispute: IUmojaLinnDispute;
  currentUserId?: string;
  currency?: UmojaLinnCurrency | null;
  expanded: boolean;
  isResponding: boolean;
  isDetailLoading?: boolean;
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
  projectId: string;
  currency?: UmojaLinnCurrency | null;
  fullRefundAmount?: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export interface IDisputeResolvedContentProps {
  dispute: IUmojaLinnDispute;
  currency?: UmojaLinnCurrency | null;
  currentUserId?: string;
}

export interface IDisputeActivitiesProps {
  dispute: IUmojaLinnDispute;
  currency?: UmojaLinnCurrency | null;
}

export interface IDisputeStatusBadgeProps {
  status: TDisputeStatus;
}

export interface IDisputeMilestoneDisplay {
  milestoneId: string;
  label: string;
  amount: number;
  isRefunded: boolean;
}

export type TDisputeActivityItem =
  | {
      id: string;
      date: string;
      title: string;
      kind: "event";
    }
  | {
      id: string;
      date: string;
      title: string;
      kind: "buyer-response";
      message: string;
      attachments?: string[];
    }
  | {
      id: string;
      date: string;
      title: string;
      kind: "outcome";
      refundedAmount?: number;
      reason?: string;
      paymentNote?: string;
    };
