/**
 * Sizing template utility functions
 */

import {
  FREE_TEMPLATE_LIMIT,
  REMINDER_COOLDOWN_MINUTES,
} from "@/types/constants";

export type TSizingGender = "MALE" | "FEMALE";

export const isFreeTemplateTier = (numberOfTemplates: number): boolean =>
  numberOfTemplates === FREE_TEMPLATE_LIMIT;

export const getAtLimitCtaLabel = (numberOfTemplates: number): string =>
  isFreeTemplateTier(numberOfTemplates)
    ? "Max 3 templates reached"
    : "Buy Template";

export const getAtLimitMessage = (numberOfTemplates: number): string | null =>
  isFreeTemplateTier(numberOfTemplates) ? "Maximum 3 templates reached" : null;

/** True when project gender is set and matches the template gender */
export const isMatchingSizingGender = (
  templateGender: TSizingGender,
  projectGender: null | TSizingGender | undefined,
): boolean => {
  if (!projectGender) return false;
  return templateGender === projectGender;
};

/** Templates compatible with a project's gender (empty if project gender unset) */
export const filterTemplatesForProject = <T extends { gender: TSizingGender }>(
  templates: T[],
  projectGender: null | TSizingGender | undefined,
): T[] => {
  if (!projectGender) return [];
  return templates.filter((t) => t.gender === projectGender);
};

export const getSizingGenderLabel = (gender: TSizingGender): string =>
  gender === "FEMALE" ? "Female" : "Male";

export const getNoMatchingSizingTemplateMessage = (): string =>
  "No Sizing Template available";

export const getNoMatchingSizingTemplateDescription = (): string =>
  "No Sizing Template available. You can add a sizing template later from the Sizing templates tab.";

export const getOppositeGenderTemplateWarningDescription = (
  templateGender: TSizingGender,
  projectGender: TSizingGender,
): string =>
  `This sizing template is for ${getSizingGenderLabel(templateGender)} but your project is for ${getSizingGenderLabel(projectGender)}. Adding it to this project will change it to a ${getSizingGenderLabel(templateGender)} template`;

export const getOppositeGenderProjectWarningDescription = (
  projectGender: TSizingGender,
  templateGender: TSizingGender,
): string =>
  `This project is for ${getSizingGenderLabel(projectGender)} but your sizing template is for ${getSizingGenderLabel(templateGender)}. Adding it to this project will change it to a ${getSizingGenderLabel(templateGender)} template`;

/** Projects compatible with a template's gender */
export const filterProjectsForTemplate = <
  T extends { gender: null | TSizingGender },
>(
  projects: T[],
  templateGender: TSizingGender,
): T[] =>
  projects.filter((p) => isMatchingSizingGender(templateGender, p.gender));

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

type TSizingTemplateMeasurementGate = {
  requestedMeasurementPoints?: string[];
  submittedMeasurementPoints?: string[];
};

/** Block designer milestone submit until measurement points are requested and filled */
export const shouldDisableDesignerMilestoneSubmission = (
  sizingTemplateId: string | undefined | null,
  sizingTemplate: TSizingTemplateMeasurementGate | undefined | null,
): boolean => {
  if (!sizingTemplateId || !sizingTemplate) return false;

  const requested = sizingTemplate.requestedMeasurementPoints ?? [];
  const submitted = sizingTemplate.submittedMeasurementPoints ?? [];

  if (requested.length === 0) {
    return submitted.length === 0;
  }

  return getPendingMeasurementsCount(requested, submitted) > 0;
};
