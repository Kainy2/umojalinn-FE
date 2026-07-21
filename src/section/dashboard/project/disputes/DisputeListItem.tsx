"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { IDisputeListItemProps } from "./@types";
import {
  DISPUTE_TYPE_TITLES,
  getDisputeFullRefundAmount,
  hasDisputeActivities,
  requiresDisputeResponse,
} from "./utils";
import DisputeStatusBadge from "./DisputeStatusBadge";
import DisputeActionBanner from "./DisputeActionBanner";
import DisputeResponseForm from "./DisputeResponseForm";
import DisputeResolvedContent from "./DisputeResolvedContent";
import DisputeActivities from "./DisputeActivities";

const DisputeListItem = ({
  dispute,
  currentUserId,
  currency,
  expanded,
  isResponding,
  isDetailLoading,
  onToggleExpand,
  onRespondNow,
  onCancelResponse,
  onResponseSuccess,
}: IDisputeListItemProps) => {
  const title = DISPUTE_TYPE_TITLES[dispute.type];
  const dateLabel = format(new Date(dispute.createdAt), "MMM d, yyyy, h:mm a");
  const requiresResponse = requiresDisputeResponse(dispute, currentUserId);
  const showActionBanner = requiresResponse && !isResponding;
  const showResponseForm = requiresResponse && isResponding;
  const showActivities = hasDisputeActivities(dispute);

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
          {isDetailLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <>
              <DisputeResolvedContent
                dispute={dispute}
                currency={currency}
                currentUserId={currentUserId}
              />

              {showActionBanner && (
                <DisputeActionBanner
                  responseDeadline={dispute.autoResolveAt ?? undefined}
                  onRespondNow={onRespondNow}
                />
              )}

              {showResponseForm && (
                <DisputeResponseForm
                  disputeId={dispute.id}
                  projectId={dispute.projectId}
                  currency={currency}
                  fullRefundAmount={getDisputeFullRefundAmount(dispute)}
                  onCancel={onCancelResponse}
                  onSuccess={onResponseSuccess}
                />
              )}

              {showActivities && (
                <DisputeActivities dispute={dispute} currency={currency} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DisputeListItem;
