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

const getResponseTitle = (
  responderType?: string | null,
  actorType?: string | null,
) => {
  const type = responderType ?? actorType;
  if (type === "BUYER") return "Buyer response";
  if (type === "DESIGNER") return "Designer response";
  return "Response";
};

const findMatchingResponse = (
  event: IUmojaLinnDisputeEvent,
  responses: IUmojaLinnDisputeResponse[],
) => {
  const candidates = responses.filter(
    (response) =>
      !!event.actorUserId && response.responderUserId === event.actorUserId,
  );

  if (!candidates.length) return undefined;
  if (candidates.length === 1) return candidates[0];

  const eventTime = new Date(event.createdAt).getTime();
  return candidates.reduce((closest, response) => {
    const closestDiff = Math.abs(
      new Date(closest.createdAt).getTime() - eventTime,
    );
    const responseDiff = Math.abs(
      new Date(response.createdAt).getTime() - eventTime,
    );
    return responseDiff < closestDiff ? response : closest;
  });
};

const isResolutionEvent = (eventType: string) =>
  eventType === "RESOLUTION_APPROVED" || eventType.startsWith("RESOLUTION_");

const buildActivityItems = (dispute: IDisputeActivitiesProps["dispute"]) => {
  const events = [...(dispute.events ?? dispute.activityTimeline ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const responses = dispute.responses ?? [];
  const approvedAmount = parseDisputeAmount(
    dispute.refundApproved ?? dispute.approvedRefundAmount,
  );

  const items: TDisputeActivityItem[] = [];

  events.forEach((event: IUmojaLinnDisputeEvent) => {
    if (event.eventType === "DISPUTE_CREATED") {
      items.push({
        id: event.id,
        date: event.createdAt,
        title: "Dispute raised",
        kind: "event",
      });
      return;
    }

    if (event.eventType === "DEFENCE_SUBMITTED") {
      const matchedResponse = findMatchingResponse(event, responses);
      items.push({
        id: event.id,
        date: event.createdAt,
        title: getResponseTitle(
          matchedResponse?.responderType,
          event.actorType,
        ),
        kind: "response",
        message: matchedResponse?.message,
        attachments: matchedResponse?.attachments,
      });
      return;
    }

    if (isResolutionEvent(event.eventType)) {
      items.push({
        id: event.id,
        date: event.createdAt,
        title:
          approvedAmount > 0
            ? "Outcome: Refund Issued"
            : "Outcome: No Refund Issued",
        kind: "outcome",
        refundedAmount: approvedAmount,
        reason:
          dispute.externalNotes ??
          (event.metadata?.externalNotes as string | undefined) ??
          dispute.reasonDetail ??
          undefined,
        paymentNote:
          approvedAmount > 0
            ? "Funds will be returned to the buyer's original payment method within 5–7 business days."
            : undefined,
      });
    }
  });

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
  const activityDate = new Date(activity.date);
  const dateLabel = format(activityDate, "MMM d");
  const timeLabel = format(activityDate, "h:mm a");
  const hasExpandableContent =
    (activity.kind === "response" && !!activity.message) ||
    (activity.kind === "outcome" &&
      (activity.refundedAmount != null ||
        activity.reason ||
        activity.paymentNote));

  return (
    <li className="flex gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-success text-success">
        <Check className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 pb-6">
        <div className="flex items-start gap-8">
          <div>
            <p className="text-sm font-medium text-foreground-body">
              {dateLabel} – {activity.title}
            </p>
            <p className="text-xs text-muted-foreground">{timeLabel}</p>
          </div>
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

        {expanded && activity.kind === "response" && activity.message && (
          <div className="mt-2 space-y-2">
            <blockquote className="text-sm italic text-muted-foreground">
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
                      width={100}
                      height={100}
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
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
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
