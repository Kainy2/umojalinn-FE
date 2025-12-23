import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "./project";

/** Reminder types for sizing template reminders */
export const SIZING_TEMPLATE_REMINDER_TYPE = {
  BUYER_REMINDER: "BUYER_REMINDER",
  DESIGNER_REMINDER: "DESIGNER_REMINDER",
} as const;

export type SizingTemplateReminderType = typeof SIZING_TEMPLATE_REMINDER_TYPE[keyof typeof SIZING_TEMPLATE_REMINDER_TYPE];

/** Default cooldown period for reminders in minutes */
export const REMINDER_COOLDOWN_MINUTES = 30;

/**
 * Template modes for the sizing template page
 * - SELECT: Designer selects which measurement points to request from buyer
 * - VIEW: Designer views submitted values (read-only)
 * - RECOMMEND: Designer adds recommendations/comments on specific measurements
 * - FILL: Buyer fills in the requested measurement points
 * - UPDATE: Buyer updates fields that have designer recommendations
 * - EDIT: Buyer has full edit access (draft/live templates not in use)
 * - VIEW_ONLY: Read-only view for buyer (all submitted, no pending reviews)
 */
export const TEMPLATE_MODE = {
  SELECT: "SELECT",
  VIEW: "VIEW",
  RECOMMEND: "RECOMMEND",
  FILL: "FILL",
  UPDATE: "UPDATE",
  EDIT: "EDIT",
  VIEW_ONLY: "VIEW_ONLY",
} as const;

export type TemplateMode = typeof TEMPLATE_MODE[keyof typeof TEMPLATE_MODE];


export const DEFAULT_HEIGHT = 0;
export const DEFAULT_UK_SIZE: UmojalinnStandardSize = "XXS";
export const DEFAULT_UNIT: UmojaLinnSizingTemplate["unit"] = "CM";