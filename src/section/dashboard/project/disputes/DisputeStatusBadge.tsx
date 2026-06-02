"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDisputeStatusBadgeProps } from "./@types";

const DisputeStatusBadge = ({ status }: IDisputeStatusBadgeProps) => {
  if (status === "RESOLVED") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-success-50 text-success",
        )}
      >
        <Check className="h-3 w-3" />
        Resolved
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-primary-50 text-[#B54708]",
      )}
    >
      In Review
    </span>
  );
};

export default DisputeStatusBadge;
