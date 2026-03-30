import {
  MilestoneStatus,
  MilestoneTimelineItem,
} from "../custom/milestone/Timeline";

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
    case MilestoneStatus.PROCESSING:
      return "border-gray-400 text-gray-400";
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
    case MilestoneStatus.PROCESSING:
      return "bg-gray-400 text-gray-50";
    case MilestoneStatus.REVIEW:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.INACTIVE:
    default:
      return "bg-gray-300 text-gray-50";
  }
};
