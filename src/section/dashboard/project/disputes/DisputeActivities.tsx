"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { IDisputeActivitiesProps, IDisputeActivity } from "./@types";

const DisputeActivityItem = ({
  activity,
  currency,
}: {
  activity: IDisputeActivity;
  currency?: IDisputeActivitiesProps["currency"];
}) => {
  const [expanded, setExpanded] = useState(false);
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const dateLabel = format(new Date(activity.date), "MMM d");

  const hasExpandableContent =
    activity.expandable &&
    (activity.body || activity.outcomeDetails);

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

        {expanded && activity.body && (
          <blockquote className="mt-2 border-l-2 border-gray-200 pl-3 text-sm text-muted-foreground">
            &ldquo;{activity.body}&rdquo;
          </blockquote>
        )}

        {expanded && activity.outcomeDetails && (
          <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3 text-sm text-muted-foreground">
            {activity.outcomeDetails.refundedAmount != null && (
              <p>
                <span className="font-semibold text-foreground-body">
                  Refunded Amount:{" "}
                </span>
                {currencySymbol}
                {formatCurrencyValue(activity.outcomeDetails.refundedAmount)}
              </p>
            )}
            {activity.outcomeDetails.reason && (
              <p>{activity.outcomeDetails.reason}</p>
            )}
            {activity.outcomeDetails.paymentNote && (
              <p className="text-xs">{activity.outcomeDetails.paymentNote}</p>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

const DisputeActivities = ({ activities, currency }: IDisputeActivitiesProps) => {
  if (!activities?.length) return null;

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
