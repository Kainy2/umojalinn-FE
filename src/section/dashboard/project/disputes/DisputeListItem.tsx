"use client";

import React from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDisputeListItemProps } from "./@types";
import { DISPUTE_TYPE_TITLES } from "./mockDisputes";
import DisputeStatusBadge from "./DisputeStatusBadge";
import DisputeActionBanner from "./DisputeActionBanner";
import DisputeResponseForm from "./DisputeResponseForm";
import DisputeResolvedContent from "./DisputeResolvedContent";
import DisputeActivities from "./DisputeActivities";

const DisputeListItem = ({
  dispute,
  currency,
  expanded,
  isResponding,
  onToggleExpand,
  onRespondNow,
  onCancelResponse,
  onSubmitResponse,
}: IDisputeListItemProps) => {
  const title = DISPUTE_TYPE_TITLES[dispute.type];
  const dateLabel = format(new Date(dispute.createdAt), "MMM d, yyyy");
  const showInReviewContent =
    dispute.status === "IN_REVIEW" && dispute.requiresResponse;
  const showResolvedContent = dispute.status === "RESOLVED";

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={onToggleExpand}
        className={cn(
          "flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left",
          "hover:bg-gray-100/80",
        )}
      >
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground-body">
          {title}
        </span>
        <span className="text-sm text-muted-foreground">{dateLabel}</span>
        <DisputeStatusBadge status={dispute.status} />
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-primary" />
        )}
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-gray-200 bg-white px-4 pb-4 pt-4">
          {(showInReviewContent || showResolvedContent) && (
            <DisputeResolvedContent dispute={dispute} currency={currency} />
          )}

          {showInReviewContent && !isResponding && (
            <DisputeActionBanner
              responseDeadline={dispute.responseDeadline}
              onRespondNow={onRespondNow}
            />
          )}

          {showInReviewContent && isResponding && (
            <DisputeResponseForm
              currency={currency}
              fullRefundAmount={dispute.fullRefundAmount}
              onCancel={onCancelResponse}
              onSubmit={onSubmitResponse}
            />
          )}

          {showResolvedContent && (
            <DisputeActivities
              activities={dispute.activities}
              currency={currency}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DisputeListItem;
