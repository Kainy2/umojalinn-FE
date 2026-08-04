import {
  DISPUTE_REASONS,
  IUmojaLinnDispute,
  TDisputeApiType,
  TDisputeResolution,
  TPreferredResolution,
} from "@/types/dispute";
import {
  IDisputeMilestoneDisplay,
  TDisputeResolutionPreference,
} from "./@types";

export const DISPUTE_TYPE_TITLES: Record<TDisputeApiType, string> = {
  BUYER_ISSUE: "Buyer Issue",
  DESIGNER_CANCELLATION_REQUEST: "Designer Cancellation Request",
  DESIGNER_REFUND_REQUEST: "Designer Refund Request",
};

export const DISPUTE_RESOLUTION_LABELS: Record<TDisputeResolution, string> = {
  PARTIAL_REFUND: "Partial refund",
  FULL_REFUND: "Full refund",
  APPROVE_CANCELLATION: "Cancellation approved",
  NO_REFUND: "No refund",
};

export const getDisputeReasonLabel = (dispute: IUmojaLinnDispute) => {
  if (!dispute.reasonCategory) return "";

  const matchedReason = DISPUTE_REASONS.find(
    (item) =>
      item.value === dispute.reasonCategory ||
      item.label === dispute.reasonCategory,
  );

  return matchedReason?.label ?? dispute.reasonCategory;
};

export const getDisputeResolutionLabel = (
  resolution?: TDisputeResolution | null,
) => {
  if (!resolution) return null;
  return DISPUTE_RESOLUTION_LABELS[resolution] ?? resolution;
};

export const formatTimeRemaining = (deadline?: string | null) => {
  if (!deadline) return null;

  const end = new Date(deadline).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};

export const parseDisputeAmount = (
  value: string | number | null | undefined,
): number => {
  if (value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const requiresDisputeResponse = (
  dispute: IUmojaLinnDispute,
  currentUserId?: string,
) =>
  dispute.status === "OPEN" ||
  (dispute.status === "IN_REVIEW" &&
    !!currentUserId &&
    currentUserId === dispute.respondentUserId &&
    !dispute.responses?.length);

export const getDisputeFullRefundAmount = (dispute: IUmojaLinnDispute) =>
  parseDisputeAmount(dispute.requestedRefundAmount ?? dispute.escrowAmount);

export const hasDisputeActivities = (dispute: IUmojaLinnDispute) =>
  !!(dispute.events?.length || dispute.activityTimeline?.length) ||
  !!dispute.responses?.length;

export const formatMilestoneStatusLabel = (status?: string) => {
  if (!status) return null;
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const getDisputeMilestoneDisplays = (
  dispute: IUmojaLinnDispute,
): IDisputeMilestoneDisplay[] => {
  if (dispute.disputeMilestones?.length) {
    return dispute.disputeMilestones.map((disputeMilestone) => ({
      milestoneId: disputeMilestone.milestoneId,
      label: disputeMilestone.milestone?.title
        ? `Milestone: ${disputeMilestone.milestone.title}`
        : "Related milestone",
      amount: parseDisputeAmount(
        disputeMilestone.milestone?.amount ?? disputeMilestone.escrowAmount,
      ),
      status: disputeMilestone.milestone?.status,
    }));
  }

  const milestone = dispute.milestone;
  if (!milestone) return [];

  return [
    {
      milestoneId: milestone.id ?? dispute.milestoneId ?? "",
      label: milestone.title
        ? `Milestone: ${milestone.title}`
        : "Related milestone",
      amount: parseDisputeAmount(milestone.amount ?? dispute.escrowAmount),
      status: milestone.status,
    },
  ];
};

export const mapPreferredResolutionToApi = (
  preference: TDisputeResolutionPreference,
): TPreferredResolution => {
  switch (preference) {
    case "FULL":
      return "FULL_REFUND";
    case "PARTIAL":
      return "PARTIAL_REFUND";
    case "NONE":
    default:
      return "NO_REFUND";
  }
};
