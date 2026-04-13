"use client";
/**
 * MeasurementPointsReminderBanner - Banner shown when measurement points haven't been requested/sent.
 * - Buyer view: "Designer has not sent the measurement point" with reminder button
 * - Designer view: "Set up your Measurement Point to trigger milestones" with link to request
 */

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, Clock } from "lucide-react";
import { useSendSizingTemplateReminder } from "@/tanstack/hooks/useSizingTemplates";
import { canSendReminder, getRemainingReminderTime } from "@/lib/sizing-template-utils";
import { SIZING_TEMPLATE_REMINDER_TYPE, REMINDER_COOLDOWN_MINUTES } from "@/types/constants";
import Link from "next/link";
import { uuidToBase62Safe } from "@/lib/uuid";

type MeasurementPointsReminderBannerProps = {
  templateId: string;
  projectId: string;
  lastReminderSentAt?: string;
  isBuyer: boolean;
  className?: string;
  isAwaitingMeasurementPointsValues?: boolean;
  isProjectLive: boolean;
  lastReminderSentBy?: string;
};

const MeasurementPointsReminderBanner = ({
  templateId,
  projectId,
  lastReminderSentAt,
  isBuyer,
  className,
  isAwaitingMeasurementPointsValues,
  isProjectLive,
  lastReminderSentBy,
}: MeasurementPointsReminderBannerProps) => {
  const isCorrectActorOnCooldown = lastReminderSentBy === (isBuyer ? SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER : SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER);

  const [remainingTime, setRemainingTime] = useState<string | null>(
    isCorrectActorOnCooldown ? getRemainingReminderTime(lastReminderSentAt) : null
  );
  const [canSend, setCanSend] = useState(
    isCorrectActorOnCooldown ? canSendReminder(lastReminderSentAt) : true
  );

  // Update remaining time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const isStillOnCooldown = lastReminderSentBy === (isBuyer ? SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER : SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER);
      setRemainingTime(isStillOnCooldown ? getRemainingReminderTime(lastReminderSentAt) : null);
      setCanSend(isStillOnCooldown ? canSendReminder(lastReminderSentAt) : true);
    }, 60000);
    return () => clearInterval(interval);
  }, [lastReminderSentAt, lastReminderSentBy, isBuyer]);

  // Update immediately when lastReminderSentAt changes
  useEffect(() => {
    const isStillOnCooldown = lastReminderSentBy === (isBuyer ? SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER : SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER);
    setRemainingTime(isStillOnCooldown ? getRemainingReminderTime(lastReminderSentAt) : null);
    setCanSend(isStillOnCooldown ? canSendReminder(lastReminderSentAt) : true);
  }, [lastReminderSentAt, lastReminderSentBy, isBuyer]);

  const { mutate: sendReminder, isPending } = useSendSizingTemplateReminder(templateId, {
    onSuccess: () => {
      setCanSend(false);
      setRemainingTime(`${REMINDER_COOLDOWN_MINUTES} minutes`);
    },
  });

  const handleSendReminder = () => {
    sendReminder({
      projectId,
      reminderType: isBuyer
        ? SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER
        : SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER,
    });
  };

  // Buyer view - reminder to Designer that he has not sent measurement points
  if (isBuyer && isProjectLive) {
    return (
      <div
        className={cn(
          "bg-amber-50 border-b border-amber-200 p-2 animate-in fade-in duration-300",
          className
        )}
      >
        <div className="flex items:start lg:items-center gap-3 justify-center w-full ">
          <Bell className="size-5 text-amber-600 shrink-0" />
          <div className="flex- flex gap-2 flex-col lg:flex-row items-start lg:items-center  ">
            <p className="text-sm font-medium text-foreground-body">
              Designer has not sent the measurement points
            </p>
            <button
              onClick={handleSendReminder}
              disabled={!canSend || isPending}
              className={cn(
                "text-sm text-primary font-medium underline hover:no-underline transition-colors",
                (!canSend || isPending) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isPending ? "Sending..." : "Send Reminder"}
            </button>
            {!canSend && remainingTime && (
              <div className="flex items-center gap-1 text-xs text-amber-700">
                <Clock className="size-3" />
                <span>Wait {remainingTime} before sending another reminder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Designer view - After sending measurement points, be able to remind Buyer to fill measurement point values
  if (isAwaitingMeasurementPointsValues) {
    return (
      <div
        className={cn(
          "bg-amber-50 border-b border-amber-200 p-2 animate-in fade-in duration-300",
          className
        )}
      >
        <div className="flex items-start lg:items-center gap-2 lg:gap-3 justify-center w-full">
          <Bell className="size-5 text-amber-600 shrink-0" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 text-center lg:text-left">
            <p className="text-sm font-medium text-foreground-body">
              Awaiting template from buyer
            </p>
            <button
              onClick={handleSendReminder}
              disabled={!canSend || isPending}
              className={cn(
                "text-sm text-primary font-medium underline hover:no-underline transition-colors",
                (!canSend || isPending) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isPending ? "Sending..." : "Send Reminder"}
            </button>
            {!canSend && remainingTime && (
              <div className="flex items-center gap-1 text-xs text-amber-700">
                <Clock className="size-3" />
                <span>Wait {remainingTime} before sending another reminder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Designer view - Link to request measurement point fields in sizing template page
  return (
    <div
      className={cn(
        "bg-amber-50 border-b border-amber-200 p-2 animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3 justify-center w-full">
        <Bell className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex gap-2 justify-center">
          <p className="text-sm font-medium text-foreground-body">
            Set up your Measurement Points to trigger milestones.
          </p>
          <Link
            href={`/sizing-templates/${uuidToBase62Safe(templateId)}?projectId=${uuidToBase62Safe(projectId)}`}
            className="text-sm text-primary font-medium underline hover:no-underline transition-colors"
          >
            Request Sizing template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MeasurementPointsReminderBanner;

