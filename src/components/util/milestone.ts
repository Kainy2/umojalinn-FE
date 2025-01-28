import {
  MilestoneStatus,
  MilestoneTimelineItem,
} from "../custom/milestone/Timeline";

export const getLabel = (status: MilestoneTimelineItem["status"]) => {
  switch (status) {
    case MilestoneStatus.AWAITING_FUND:
      return "Awaiting fund";

    case MilestoneStatus.IN_REVIEW:
      return "In Review";
    case MilestoneStatus.ACTIVE:
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
      return "border-gray-500 text-gray-500";
    case MilestoneStatus.IN_REVIEW:
    case MilestoneStatus.AWAITING_FUND:
      return "border-error-400 text-error-400";
    case MilestoneStatus.PAID:
      return "border-success text-success";
    case MilestoneStatus.COMPLETED:
      return "border-success text-success";
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
      return "bg-gray-500 text-white";
    case MilestoneStatus.IN_REVIEW:
    case MilestoneStatus.AWAITING_FUND:
      return "bg-error-400 text-error-50";
    case MilestoneStatus.PAID:
      return "bg-success text-success-50";
    case MilestoneStatus.COMPLETED:
      return "bg-success text-success-50";
    case MilestoneStatus.REVIEW:
    case MilestoneStatus.INACTIVE:
    default:
      return "bg-gray-300 text-gray-50";
  }
};
