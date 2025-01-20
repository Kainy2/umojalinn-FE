import { cn } from "@/lib/utils";
import React from "react";
type MilestoneProgressProps = {
  value: number;
  total: number;
  className?: string
};

const MilestoneProgress = (props: MilestoneProgressProps) => {
  return (
    <div className={cn("flex gap-2", props.className)}>
      {new Array(props.total).fill("").map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 bg-gray-100 rounded-full w-full",
            index < (props.value || 0) && "bg-success"
          )}
        />
      ))}
    </div>
  );
};

export default MilestoneProgress;
