"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDisputeStatusBadgeProps } from "./@types";

const DisputeStatusBadge = ({ status }: IDisputeStatusBadgeProps) => {
  let badgeConfig;

  switch (status) {
    case "RESOLVED":
      badgeConfig = {
        label: "Resolved",
        className: "bg-success-50 text-success",
        icon: true,
      };
      break;

    case "AWAITING_PSP_CONFIRMATION":
      badgeConfig = {
        label: "Processing refund",
        className: "bg-gray-100 text-muted-foreground",
        icon: false,
      };
      break;

    case "OPEN":
    default:
      badgeConfig = {
        label: "In Review",
        className: "bg-primary-50 text-[#B54708]",
        icon: false,
      };
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeConfig.className,
      )}
    >
      {badgeConfig.icon && <Check className="h-3 w-3" />}
      {badgeConfig.label}
    </span>
  );
};

export default DisputeStatusBadge;
