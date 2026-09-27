/**
 * Sizing template utility functions
 */

import { ALL_SIZING_TEMPLATES } from "@/constant/sizingTemplate";
import {
  FREE_TEMPLATE_LIMIT,
  REMINDER_COOLDOWN_MINUTES,
} from "@/types/constants";
import { UmojaLinnSizingTemplate } from "@/types/project";

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
  `This sizing template is for ${getSizingGenderLabel(templateGender)} but your project is for ${getSizingGenderLabel(projectGender)}. Continuing will clear all measurements and convert it to a ${getSizingGenderLabel(projectGender)} template. You'll need to re-enter standard size and height.`;

export const getOppositeGenderProjectWarningDescription = (
  projectGender: TSizingGender,
  templateGender: TSizingGender,
): string =>
  `This project is for ${getSizingGenderLabel(projectGender)} but your sizing template is for ${getSizingGenderLabel(templateGender)}. Continuing will clear all measurements and convert it to a ${getSizingGenderLabel(projectGender)} template. You'll need to re-enter standard size and height.`;

/** Null out every measurement field and set gender for an opposite-gender conversion */
export const getClearedSizingTemplatePayload = (
  targetGender: TSizingGender,
): Partial<UmojaLinnSizingTemplate> => {
  const clearedMeasurements = Object.fromEntries(
    ALL_SIZING_TEMPLATES.map((item) => [item.prop, null]),
  ) as Partial<UmojaLinnSizingTemplate>;

  return {
    ...clearedMeasurements,
    gender: targetGender,
    height: null,
    ukStandardSize: null,
  };
};

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

/**
 * Returns true when there are requested measurement points that haven't all
 * been submitted yet (tally mismatch).
 * Pending alone does not mean "changes recommended" — use
 * `isMeasurementRevisionCycle` for revision pills and
 * `isFirstMeasurementFillCycle` for first-fill pills.
 */
export const hasPendingMeasurements = (
  requestedPoints?: string[],
  submittedPoints?: string[],
): boolean => {
  if (!requestedPoints?.length) return false;
  return getPendingMeasurementsCount(requestedPoints, submittedPoints) > 0;
};

/** Buyer has submitted at least one requested measurement point. */
export const hasPriorMeasurementSubmission = (
  submittedPoints?: string[],
): boolean => (submittedPoints?.length ?? 0) > 0;

/** Designer has open review comments on the template. */
export const hasOpenSizingReviews = (
  reviews?: Record<string, string> | null,
): boolean => !!reviews && Object.keys(reviews).length > 0;

/**
 * LIVE revision cycle: open reviews, or new pending points after the buyer
 * already submitted. Drives Changes Recommended / View Sizing Recommendations.
 */
export const isMeasurementRevisionCycle = ({
  isProjectLive,
  hasOpenReviews,
  requestedPoints,
  submittedPoints,
}: {
  isProjectLive: boolean;
  hasOpenReviews: boolean;
  requestedPoints?: string[];
  submittedPoints?: string[];
}): boolean => {
  if (!isProjectLive) return false;
  if (hasOpenReviews) return true;
  return (
    hasPriorMeasurementSubmission(submittedPoints) &&
    hasPendingMeasurements(requestedPoints, submittedPoints)
  );
};

/**
 * First-fill cycle: points are requested but the buyer has not submitted any yet.
 * Drives Measurement Requested / Add Requested Measurements.
 */
export const isFirstMeasurementFillCycle = ({
  requestedPoints,
  submittedPoints,
}: {
  requestedPoints?: string[];
  submittedPoints?: string[];
}): boolean =>
  !!requestedPoints?.length &&
  !hasPriorMeasurementSubmission(submittedPoints);

/**
 * Resolve requested points from template → bid → project (first non-empty wins).
 */
export const resolveRequestedMeasurementPoints = (
  ...sources: Array<string[] | undefined | null>
): string[] => {
  for (const source of sources) {
    if (source && source.length > 0) return source;
  }
  return [];
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
