import { Check, Plus } from "lucide-react";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
import { cn } from "@/lib/utils";

const MilestoneIndicator: React.FC<MilestoneTimelineItem> = ({
  isCurrent,
  status,
}) => {
  return (
    <span
      className={cn(
        "relative h-8 w-8 shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 before:content-[''] before:h-5 before:absolute before:top-1/2 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2 before:w-5 before:border before:border-gray-200 before:rounded-full",
        status === MilestoneStatus.COMPLETED &&
          "bg-success-50 before:border-success text-success",
        isCurrent && "bg-gray-50 before:border-gray-500 text-gray-500"
      )}
    >
      {status === MilestoneStatus.COMPLETED ? (
        <Check className="h-3 w-3" />
      ) : !status ||
        (status === MilestoneStatus.INACTIVE && !isCurrent) ? null : (
        <Plus className="h-3 w-3" />
      )}
    </span>
  );
};

export default MilestoneIndicator;
