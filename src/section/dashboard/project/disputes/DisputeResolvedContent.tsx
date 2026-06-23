"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { IDisputeResolvedContentProps } from "./@types";
import {
  DISPUTE_TYPE_TITLES,
  getDisputeMilestoneDisplays,
  getDisputeReasonLabel,
  getDisputeResolutionLabel,
  parseDisputeAmount,
} from "./utils";

const DisputeResolvedContent = ({
  dispute,
  currency,
  currentUserId,
}: IDisputeResolvedContentProps) => {
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const reasonLabel = getDisputeReasonLabel(dispute);
  const disputeMilestones = getDisputeMilestoneDisplays(dispute);
  const disputeTypeLabel = DISPUTE_TYPE_TITLES[dispute.type];
  const resolutionLabel = getDisputeResolutionLabel(dispute.resolution);
  const approvedRefundAmount = parseDisputeAmount(
    dispute.refundApproved ?? dispute.approvedRefundAmount,
  );
  const projectTitle = dispute.project?.title;
  const isOwnDispute =
    !!currentUserId && currentUserId === dispute.initiatorUserId;
  const rationaleLabel = isOwnDispute ? "Your rationale" : "Reason";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {projectTitle && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Project
            </p>
            <p className="text-sm font-semibold text-foreground-body">
              {projectTitle}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dispute type
          </p>
          <p className="text-sm font-semibold text-foreground-body">
            {disputeTypeLabel}
          </p>
        </div>
      </div>

      {reasonLabel && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {rationaleLabel}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground-body">
            {reasonLabel}
          </p>
        </div>
      )}

      {dispute.reasonDetail && (
        <blockquote className="border-l-2 border-gray-200 pl-3 text-sm text-muted-foreground">
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
          <ul className="flex flex-col gap-3">
            {disputeMilestones.map((disputeMilestone) => (
              <li
                key={disputeMilestone.milestoneId}
                className="flex flex-wrap items-center  gap-2"
              >
                <span className="text-sm text-foreground-body">
                  {disputeMilestone.label}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full font-normal pr-0 py-0",
                    !disputeMilestone.isRefunded &&
                      "border-error/30 bg-error-50 text-error",
                    disputeMilestone.isRefunded &&
                      "border-gray-300 bg-gray-50 text-foreground-body",
                  )}
                >
                  {disputeMilestone.isRefunded ? "Refunded" : "Disputed"}{" "}
                  <span className="text-xs text-white bg-[#FDA29B] rounded-full px-2 py-1 ml-2">
                    {currencySymbol}
                    {formatCurrencyValue(disputeMilestone.amount)}
                  </span>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DisputeResolvedContent;
