"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { IDisputeResolvedContentProps } from "./@types";
import { getDisputeReasonLabel } from "./utils";

const DisputeResolvedContent = ({
  dispute,
  currency,
}: IDisputeResolvedContentProps) => {
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const reasonLabel = getDisputeReasonLabel(dispute);

  return (
    <div className="flex flex-col gap-6">
      {reasonLabel && (
        <div>
          <p className="text-sm font-semibold text-foreground-body">
            {reasonLabel}
          </p>
        </div>
      )}

      {dispute.description && (
        <blockquote className="border-l-0 text-sm text-muted-foreground">
          &ldquo;{dispute.description}&rdquo;
        </blockquote>
      )}

      {!!dispute.attachments?.length && (
        <div className="grid grid-cols-4 gap-2 max-w-md">
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

      {!!dispute.relatedMilestones?.length && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground-body">
            Related Milestones
          </h4>
          <ul className="flex flex-col gap-3">
            {dispute.relatedMilestones.map((milestone) => (
              <li
                key={milestone.milestoneId}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-sm text-foreground-body">
                  {milestone.label}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-sm font-normal",
                    milestone.tag === "DISPUTED" &&
                      "border-error/30 bg-error-50 text-error",
                    milestone.tag === "REFUNDED" &&
                      "border-gray-300 bg-gray-50 text-foreground-body",
                  )}
                >
                  {milestone.tag === "DISPUTED"
                    ? "Disputed"
                    : "Refunded"}{" "}
                  {currencySymbol}
                  {formatCurrencyValue(milestone.amount)}
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
