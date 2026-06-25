import {
  MilestoneStatus,
  MilestoneTimelineItem,
} from "../custom/milestone/Timeline";
import { UmojaLinnMilestone, UmojaLinnMilestoneSubmissionStatus } from "@/types/project";

export const getMilestoneDisplayName = (
  milestone: Pick<UmojaLinnMilestone, "title" | "deliveryMethod">,
): string => {
  const isDelivery = !!milestone.deliveryMethod;

  if (milestone.title?.trim()) {
    return milestone.title.trim();
  }

  if (isDelivery) {
    return "Delivery Milestone";
  }

  return "No title";
};

export const formatMilestoneSelectLabel = (
  milestone: UmojaLinnMilestone,
  allMilestones: UmojaLinnMilestone[],
): string => {
  const isDelivery = !!milestone.deliveryMethod;

  if (isDelivery) {
    return "Delivery Milestone";
  }

  const nonDeliveryMilestones = allMilestones.filter((item) => !item.deliveryMethod);
  const milestoneIndex = nonDeliveryMilestones.findIndex(
    (item) => item.id === milestone.id,
  );

  return `Milestone ${milestoneIndex + 1}: ${getMilestoneDisplayName(milestone)}`;
};

export function canBuyerFundMilestone({
  isVariableDelivery,
  variableSubmissionStatus,
}: {
  isVariableDelivery: boolean;
  variableSubmissionStatus?: UmojaLinnMilestoneSubmissionStatus;
}): boolean {
  if (!isVariableDelivery) return true;
  return variableSubmissionStatus === "APPROVED";
}

export const getLabel = (status: MilestoneTimelineItem["status"], isDesigner?: boolean) => {
  switch (status) {
    case MilestoneStatus.AWAITING_FUND:
      return "Awaiting fund";
    case MilestoneStatus.REVIEW:
      return "Review"
    case MilestoneStatus.IN_REVIEW:
      return isDesigner ? "In Review" : "Review";
    case MilestoneStatus.ACTIVE:
      return ""
    case MilestoneStatus.COMPLETED:
      return "Paid"
    case MilestoneStatus.DISPUTED:
      return "Disputed"
    case MilestoneStatus.REFUNDED:
      return "Refunded"
    case MilestoneStatus.PROCESSING:
      return "Awaiting fund"
    case MilestoneStatus.INACTIVE:
    default:
      return null;
  }
};

export const getPillWrapperStyle = (
  status: MilestoneTimelineItem["status"]
): React.ComponentProps<"span">["className"] => {
  switch (status) {
    case MilestoneStatus.REVIEW:
      return "border-gray-400 text-gray-400";
    case MilestoneStatus.ACTIVE:
      return "border-gray-400 text-white";
    case MilestoneStatus.IN_REVIEW:
      return "border-error-400 text-error-400";
    case MilestoneStatus.AWAITING_FUND:
      return "border-error-400 text-error-400";
    case MilestoneStatus.PAID:
      return "border-gray-400 text-gray-400";
    case MilestoneStatus.COMPLETED:
      return "border-success text-success";
    case MilestoneStatus.DISPUTED:
      return "border-error-400 text-error-400";
    case MilestoneStatus.REFUNDED:
      return "border-success text-success";
    case MilestoneStatus.PROCESSING:
            return "border-error-400 text-error-400";
    case MilestoneStatus.INACTIVE:
    default:
      return "border-gray-300 text-gray-300";
  }
};

export const getPillValueStyle = (
  status: MilestoneTimelineItem["status"]
): React.ComponentProps<"span">["className"] => {
  switch (status) {
    case MilestoneStatus.ACTIVE:
      return "border-gray-400 text-white";
    case MilestoneStatus.IN_REVIEW:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.AWAITING_FUND:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.PAID:
      return "bg-gray-400 text-gray-50";
    case MilestoneStatus.COMPLETED:
      return "bg-success text-success-50";
    case MilestoneStatus.DISPUTED:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.REFUNDED:
      return "bg-success text-success-50";
    case MilestoneStatus.PROCESSING:
            return "bg-error-400 text-error-50";

    case MilestoneStatus.REVIEW:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.INACTIVE:
    default:
      return "bg-gray-300 text-gray-50";
  }
};
