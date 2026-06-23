"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  IUmojaLinnDisputeEvent,
  IUmojaLinnDisputeResponse,
} from "@/types/dispute";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { IDisputeActivitiesProps, TDisputeActivityItem } from "./@types";
import { parseDisputeAmount } from "./utils";

const buildActivityItems = (dispute: IDisputeActivitiesProps["dispute"]) => {
  const items: TDisputeActivityItem[] = [];
  const events = dispute.events ?? dispute.activityTimeline ?? [];

  events.forEach((event: IUmojaLinnDisputeEvent) => {
    if (event.eventType === "DISPUTE_CREATED") {
      items.push({
        id: event.id,
        date: event.createdAt,
        title: "Dispute raised",
        kind: "event",
      });
    }
  });

  dispute.responses?.forEach((response: IUmojaLinnDisputeResponse) => {
    if (response.responderType === "BUYER") {
      items.push({
        id: response.id,
        date: response.createdAt,
        title: "Buyer response",
        kind: "buyer-response",
        message: response.message,
        attachments: response.attachments,
      });
    }
  });

  if (dispute.status === "RESOLVED") {
    const resolutionEvent = events.find(
      (event) => event.eventType === "RESOLUTION_APPROVED",
    );
    const approvedAmount = parseDisputeAmount(
      dispute.refundApproved ?? dispute.approvedRefundAmount,
    );

    if (!items.some((item) => item.kind === "outcome")) {
      items.push({
        id: resolutionEvent?.id ?? `outcome-${dispute.id}`,
        date: dispute.resolvedAt ?? dispute.updatedAt,
        title: approvedAmount
          ? "Outcome: Refund Issued"
          : "Outcome: Dispute resolved",
        kind: "outcome",
        refundedAmount: approvedAmount || undefined,
        reason:
          dispute.externalNotes ??
          (resolutionEvent?.metadata?.externalNotes as string | undefined) ??
          dispute.reasonDetail ??
          undefined,
        paymentNote: approvedAmount
          ? "Funds will be returned to the buyer's original payment method within 5–7 business days."
          : undefined,
      });
    }
  }

  return items;
};

const DisputeActivityItem = ({
  activity,
  currency,
}: {
  activity: TDisputeActivityItem;
  currency?: IDisputeActivitiesProps["currency"];
}) => {
  const [expanded, setExpanded] = useState(false);
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const dateLabel = format(new Date(activity.date), "MMM d");
  const hasExpandableContent =
    activity.kind === "buyer-response" ||
    (activity.kind === "outcome" &&
      (activity.refundedAmount != null ||
        activity.reason ||
        activity.paymentNote));

  return (
    <li className="flex gap-3">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-50 text-success before:absolute before:left-1/2 before:top-8 before:h-[calc(100%+0.5rem)] before:w-px before:-translate-x-1/2 before:bg-gray-200 before:content-[''] last:before:hidden">
        <Check className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground-body">
            {dateLabel} – {activity.title}
          </p>
          {hasExpandableContent && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="shrink-0 text-primary"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {expanded && activity.kind === "buyer-response" && (
          <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
            <blockquote className="text-sm text-muted-foreground">
              &ldquo;{activity.message}&rdquo;
            </blockquote>
            {!!activity.attachments?.length && (
              <div className="grid max-w-md grid-cols-4 gap-2">
                {activity.attachments.map((url) => (
                  <div
                    key={url}
                    className="aspect-square overflow-hidden rounded border border-gray-200 bg-gray-50"
                  >
                    <Image
                      src={url}
                      alt="Response attachment"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {expanded && activity.kind === "outcome" && (
          <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3 text-sm text-muted-foreground">
            {activity.refundedAmount != null && (
              <p>
                <span className="font-semibold text-foreground-body">
                  Refunded Amount:{" "}
                </span>
                {currencySymbol}
                {formatCurrencyValue(activity.refundedAmount)}
              </p>
            )}
            {activity.reason && <p>{activity.reason}</p>}
            {activity.paymentNote && (
              <p className="text-xs">{activity.paymentNote}</p>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

const DisputeActivities = ({ dispute, currency }: IDisputeActivitiesProps) => {
  const activities = buildActivityItems(dispute);

  if (!activities.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground-body">Activities</h4>
      <ol className="flex flex-col">
        {activities.map((activity) => (
          <DisputeActivityItem
            key={activity.id}
            activity={activity}
            currency={currency}
          />
        ))}
      </ol>
    </div>
  );
};

export default DisputeActivities;
