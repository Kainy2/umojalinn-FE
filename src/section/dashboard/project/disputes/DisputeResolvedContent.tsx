"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { IDisputeResolvedContentProps } from "./@types";
import {
  formatMilestoneStatusLabel,
  getApprovedRefundAmount,
  getDisputeMilestoneDisplays,
  getDisputeReasonLabel,
  getDisputeResolutionLabel,
} from "./utils";

const DisputeResolvedContent = ({
  dispute,
  currency,
}: IDisputeResolvedContentProps) => {
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const reasonLabel = getDisputeReasonLabel(dispute);
  const disputeMilestones = getDisputeMilestoneDisplays(dispute);
  const resolutionLabel = getDisputeResolutionLabel(dispute.resolution);
  const approvedRefundAmount = getApprovedRefundAmount(dispute);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dispute ID
          </p>
          <p className="text-sm font-semibold text-foreground-body">
            {dispute.disputeId}
          </p>
        </div>
      </div>

      {reasonLabel && (
        <div>
          <p className="mt-1 text-sm font-semibold text-foreground-body">
            {reasonLabel}
          </p>
        </div>
      )}

      {dispute.reasonDetail && (
        <blockquote className="text-sm text-muted-foreground">
          &ldquo;{dispute.reasonDetail}&rdquo;
        </blockquote>
      )}

      {dispute.status === "RESOLVED" && resolutionLabel && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resolution
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground-body">
            {resolutionLabel}
          </p>
          {approvedRefundAmount > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Refunded amount: {currencySymbol}
              {formatCurrencyValue(approvedRefundAmount)}
            </p>
          )}
          {dispute.externalNotes && (
            <p className="mt-2 text-sm text-muted-foreground">
              {dispute.externalNotes}
            </p>
          )}
        </div>
      )}

      {!!dispute.attachments?.length && (
        <div className="grid max-w-md grid-cols-4 gap-2">
          {dispute.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md bg-gray-100",
              )}
            >
              {attachment.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={attachment.url}
                  alt=""
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      )}

      {!!disputeMilestones.length && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground-body">
            Related Milestones
          </h4>
          <ul className="grid grid-cols-[max-content_auto] items-center gap-x-3 gap-y-3">
            {disputeMilestones.map((disputeMilestone) => (
              <li key={disputeMilestone.milestoneId} className="contents">
                <span className="text-sm text-foreground-body">
                  {disputeMilestone.label}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit rounded-full font-normal pr-0 py-0",
                    disputeMilestone.status === "DISPUTED"
                      ? "border-error/30 bg-error-50 text-error"
                      : "border-gray-300 bg-gray-50 text-foreground-body",
                  )}
                >
                  {formatMilestoneStatusLabel(disputeMilestone.status)}{" "}
                  <span
                    className={cn(
                      "ml-2 rounded-full px-2 py-1 text-xs text-white",
                      disputeMilestone.status === "DISPUTED"
                        ? "bg-[#FDA29B]"
                        : "bg-gray-400",
                    )}
                  >
                    {currencySymbol}
                    {formatCurrencyValue(disputeMilestone.amount)}
                  </span>
                </Badge>
              </li>
            ))}
          </ul>
          <div className="border border-gray-50" />
        </div>
      )}
    </div>
  );
};

export default DisputeResolvedContent;
