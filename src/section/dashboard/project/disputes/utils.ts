import { DISPUTE_REASONS, TPreferredResolution } from "@/types/dispute";
import { IUmojaLinnDispute } from "@/types/dispute";
import {
  IDisputeActivity,
  IProjectDispute,
  TDisputeResolutionPreference,
  TDisputeType,
} from "./@types";

export const getDisputeReasonLabel = (dispute: IProjectDispute) => {
  if (dispute.reasonLabel) return dispute.reasonLabel;
  if (!dispute.reason) return "";
  return (
    DISPUTE_REASONS.find((item) => item.value === dispute.reason)?.label ?? ""
  );
};

export const formatTimeRemaining = (deadline?: string) => {
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

const mapApiTypeToUiType = (type: IUmojaLinnDispute["type"]): TDisputeType => {
  switch (type) {
    case "DESIGNER_CANCELLATION_REQUEST":
      return "DESIGNER_CANCELLATION";
    case "DESIGNER_REFUND":
      return "DESIGNER_REFUND";
    case "BUYER_ISSUE":
    default:
      return "BUYER_ISSUE";
  }
};

const mapEventsToActivities = (
  dispute: IUmojaLinnDispute,
): IDisputeActivity[] => {
  const activities: IDisputeActivity[] = [];

  dispute.events?.forEach((event) => {
    if (event.eventType === "DISPUTE_CREATED") {
      activities.push({
        id: event.id,
        type: "DISPUTE_RAISED",
        date: event.createdAt,
        title: "Dispute raised",
      });
    }
  });

  dispute.responses?.forEach((response) => {
    if (response.responderType === "BUYER") {
      activities.push({
        id: response.id,
        type: "BUYER_RESPONSE",
        date: response.createdAt,
        title: "Buyer response",
        expandable: true,
        body: response.message,
      });
    }
  });

  const resolutionEvent = dispute.events?.find(
    (event) => event.eventType === "RESOLUTION_APPROVED",
  );
  if (dispute.status === "RESOLVED") {
    const approvedAmount = parseDisputeAmount(dispute.approvedRefundAmount);
    activities.push({
      id: resolutionEvent?.id ?? `outcome-${dispute.id}`,
      type: "OUTCOME",
      date: dispute.resolvedAt ?? dispute.updatedAt,
      title: approvedAmount
        ? "Outcome: Refund Issued"
        : "Outcome: Dispute resolved",
      expandable: true,
      outcomeDetails: approvedAmount
        ? {
            refundedAmount: approvedAmount,
            reason:
              (resolutionEvent?.metadata?.externalNotes as string) ??
              dispute.reasonDetail ??
              undefined,
            paymentNote:
              "Funds will be returned to the buyer's original payment method within 5–7 business days.",
          }
        : undefined,
    });
  }

  return activities;
};

export const mapDisputeToProjectDispute = (
  dispute: IUmojaLinnDispute,
): IProjectDispute => {
  const milestone = dispute.milestone;
  const milestoneAmount = parseDisputeAmount(
    milestone?.amount ?? dispute.escrowAmount,
  );
  const milestoneTag =
    milestone?.status === "REFUNDED" ? "REFUNDED" : "DISPUTED";

  return {
    id: dispute.id,
    type: mapApiTypeToUiType(dispute.type),
    status: dispute.status,
    createdAt: dispute.createdAt,
    reasonLabel: dispute.reasonCategory ?? undefined,
    description: dispute.reasonDetail ?? undefined,
    attachments: dispute.attachments?.map((attachment) => ({
      id: attachment.id,
      url: attachment.url,
    })),
    relatedMilestones: milestone
      ? [
          {
            milestoneId: milestone.id ?? dispute.milestoneId,
            label: milestone.title
              ? `Milestone: ${milestone.title}`
              : "Related milestone",
            amount: milestoneAmount,
            tag: milestoneTag,
          },
        ]
      : undefined,
    activities: mapEventsToActivities(dispute),
    requiresResponse: dispute.status === "IN_REVIEW",
    responseDeadline: dispute.autoResolveAt ?? undefined,
    fullRefundAmount: parseDisputeAmount(
      dispute.requestedRefundAmount ?? dispute.escrowAmount,
    ),
  };
};
