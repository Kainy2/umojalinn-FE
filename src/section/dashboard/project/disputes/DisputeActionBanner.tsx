"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IDisputeActionBannerProps } from "./@types";
import { formatTimeRemaining } from "./utils";

const DisputeActionBanner = ({
  responseDeadline,
  onRespondNow,
  className,
}: IDisputeActionBannerProps) => {
  const timeRemaining = formatTimeRemaining(responseDeadline);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-error bg-error-50 p-4",
        "md:flex-row md:items-start md:justify-between",
        className,
      )}
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
        <div className="space-y-2 text-sm text-foreground-body">
          <h4 className="font-semibold text-error">
            Action required: Respond to this dispute
          </h4>
          <p>
            For a fair review, we need your response. If no response is
            submitted within 120 hours from the time the dispute was raised, the
            dispute may be resolved in the buyer&apos;s favour and a refund may
            be issued automatically.
          </p>
          {timeRemaining && (
            <p>
              <span className="font-semibold text-error">Time remaining: </span>
              <span className="font-semibold text-error">{timeRemaining}</span>
            </p>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="destructive"
        className="shrink-0 md:self-center"
        onClick={onRespondNow}
      >
        Respond now
      </Button>
    </div>
  );
};

export default DisputeActionBanner;
