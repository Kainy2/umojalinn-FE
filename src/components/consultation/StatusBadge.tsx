import { cn } from "@/lib/utils";
import {
  BuyerConsultationStatus,
  ConsultationBookedSubStatus,
  ConsultationCompletedSubStatus,
  DesignerConsultationStatus,
} from "@/types/consultation";
import React from "react";

type ConsultationStatusBadgeProps = {
  buyerStatus?: BuyerConsultationStatus;
  designerStatus?: DesignerConsultationStatus;
  bookedSubStatus?: ConsultationBookedSubStatus | null;
  completedSubStatus?: ConsultationCompletedSubStatus | null;
  isCancelled?: boolean;
  className?: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon?: string }
> = {
  // Buyer
  MATCHING: {
    label: "Matching",
    className: "text-purple-600 bg-purple-50 border-purple-200",
    icon: "✦",
  },
  MATCHED: {
    label: "Matched",
    className: "text-blue-600 bg-blue-50 border-blue-200",
    icon: "✓",
  },
  REQUESTED: {
    label: "Requested",
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  BOOKED: {
    label: "Booked",
    className: "text-green-600 bg-green-50 border-green-200",
    icon: "✓",
  },
  LIVE: {
    label: "Live",
    className: "text-red-600 bg-red-50 border-red-200",
    icon: "•",
  },
  COMPLETED: {
    label: "Completed",
    className: "text-gray-600 bg-gray-100 border-gray-200",
    icon: "✓",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "text-gray-400 bg-gray-50 border-gray-200",
  },
  // Designer-only
  ASSIGNED: {
    label: "Assigned",
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  AWAITING_SUMMARY: {
    label: "Awaiting Summary",
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
};

const ConsultationStatusBadge = ({
  buyerStatus,
  designerStatus,
  isCancelled,
  className,
}: ConsultationStatusBadgeProps) => {
  const status = isCancelled
    ? "CANCELLED"
    : buyerStatus ?? designerStatus ?? "MATCHING";

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["MATCHING"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.icon && (
        <span className="text-[10px] leading-none">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
};

export default ConsultationStatusBadge;
