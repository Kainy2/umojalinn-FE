"use client";
/**
 * ReminderBanner - Banner for sending reminders with 30-minute cooldown timer.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Clock } from "lucide-react";

type ReminderBannerProps = {
  message: string;
  onSendReminder: () => void;
  lastReminderSentAt?: string;
  canSendReminder: boolean;
  remainingTime?: string;
  className?: string;
};

const ReminderBanner = ({
  message,
  onSendReminder,
  lastReminderSentAt,
  canSendReminder,
  remainingTime,
  className,
}: ReminderBannerProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleSendReminder = async () => {
    setIsPending(true);
    try {
      await onSendReminder();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={cn("bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-4 animate-in fade-in duration-300", className)}>
      <div className="flex items-start gap-3 flex-1">
        <Bell className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground-body">{message}</p>
          {lastReminderSentAt && (
            <p className="text-xs text-muted-foreground mt-1">Last reminder sent: {new Date(lastReminderSentAt).toLocaleString()}</p>
          )}
          {!canSendReminder && remainingTime && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
              <Clock className="size-3" />
              <span>Wait {remainingTime} before sending another reminder</span>
            </div>
          )}
        </div>
      </div>
      <Button onClick={handleSendReminder} disabled={!canSendReminder || isPending} size="sm" variant="outline" className="shrink-0 border-amber-300 hover:bg-amber-100">
        Send Reminder
      </Button>
    </div>
  );
};

export default ReminderBanner;
