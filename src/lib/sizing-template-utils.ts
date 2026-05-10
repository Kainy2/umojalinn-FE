/**
 * Sizing template utility functions
 */

import { REMINDER_COOLDOWN_MINUTES } from "@/types/constants";

const COOLDOWN_MS = REMINDER_COOLDOWN_MINUTES * 60 * 1000;

/** Check if cooldown period has passed since last reminder */
export const canSendReminder = (lastReminderSentAt?: string): boolean => {
  if (!lastReminderSentAt) return true;
  return (
    new Date().getTime() - new Date(lastReminderSentAt).getTime() >= COOLDOWN_MS
  );
};

/** Get remaining time before next reminder can be sent */
export const getRemainingReminderTime = (
  lastReminderSentAt?: string,
): string | null => {
  if (!lastReminderSentAt) return null;
  const remainingMs =
    COOLDOWN_MS -
    (new Date().getTime() - new Date(lastReminderSentAt).getTime());
  if (remainingMs <= 0) return null;
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
  return `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
};

/** Check if a measurement point is in the requested list */
export const isPointRequested = (
  point: string,
  requestedPoints?: string[],
): boolean => {
  return requestedPoints?.includes(point) ?? false;
};

/** Check if a measurement point has been submitted */
export const isPointSubmitted = (
  point: string,
  submittedPoints?: string[],
): boolean => {
  return submittedPoints?.includes(point) ?? false;
};

/** Get count of pending (requested but not submitted) measurement points */
export const getPendingMeasurementsCount = (
  requestedPoints?: string[],
  submittedPoints?: string[],
): number => {
  if (!requestedPoints) return 0;
  if (!submittedPoints) return requestedPoints.length;
  return requestedPoints.filter((point) => !submittedPoints.includes(point))
    .length;
};
