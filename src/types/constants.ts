import { UmojaLinnSizingTemplate, UmojalinnMaleStandardSize, UmojalinnFemaleStandardSize } from "./project";

// Male standard sizes array (letter-based)
export const MALE_STANDARD_SIZES: UmojalinnMaleStandardSize[] = [
  "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"
];

// Female standard sizes array (UK number-based)
export const FEMALE_STANDARD_SIZES: UmojalinnFemaleStandardSize[] = [
 "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32"
];

// UK Size Chart data for males
export const UK_SIZE_CHART_MALE = [
  { ukSize: "34", usSize: "34", euSize: "44", frSize: "44", letterSize: "XS" },
  { ukSize: "36", usSize: "36", euSize: "46", frSize: "46", letterSize: "S" },
  { ukSize: "38", usSize: "38", euSize: "48", frSize: "48", letterSize: "M" },
  { ukSize: "40", usSize: "40", euSize: "50", frSize: "50", letterSize: "L" },
  { ukSize: "42", usSize: "42", euSize: "52", frSize: "52", letterSize: "XL" },
  { ukSize: "44", usSize: "44", euSize: "54", frSize: "54", letterSize: "2XL" },
  { ukSize: "46", usSize: "46", euSize: "56", frSize: "56", letterSize: "3XL" },
  { ukSize: "48", usSize: "48", euSize: "58", frSize: "58", letterSize: "4XL" },
  { ukSize: "50", usSize: "50", euSize: "60", frSize: "60", letterSize: "5XL" },
  { ukSize: "52", usSize: "52", euSize: "62", frSize: "62", letterSize: "6XL" },
  { ukSize: "54", usSize: "54", euSize: "64", frSize: "64", letterSize: "6XL" },
  { ukSize: "56", usSize: "56", euSize: "66", frSize: "66", letterSize: "6XL" },
  { ukSize: "58", usSize: "58", euSize: "68", frSize: "68", letterSize: "6XL" },
  { ukSize: "60", usSize: "60", euSize: "70", frSize: "70", letterSize: "6XL" },
];

// UK Size Chart data for females
export const UK_SIZE_CHART_FEMALE = [
  { ukSize: "4", usSize: "0", euSize: "32", frSize: "34", letterSize: "XXS" },
  { ukSize: "6", usSize: "2", euSize: "34", frSize: "34", letterSize: "XS" },
  { ukSize: "8", usSize: "4", euSize: "36", frSize: "36", letterSize: "S" },
  { ukSize: "10", usSize: "6", euSize: "38", frSize: "38", letterSize: "S-M" },
  { ukSize: "12", usSize: "8", euSize: "40", frSize: "40", letterSize: "M" },
  { ukSize: "14", usSize: "10", euSize: "42", frSize: "42", letterSize: "M-L" },
  { ukSize: "16", usSize: "12", euSize: "44", frSize: "44", letterSize: "L" },
  { ukSize: "18", usSize: "14", euSize: "46", frSize: "46", letterSize: "XL" },
  { ukSize: "20", usSize: "16", euSize: "48", frSize: "48", letterSize: "XXL" },
  { ukSize: "22", usSize: "18", euSize: "50", frSize: "50", letterSize: "3XL" },
  { ukSize: "24", usSize: "20", euSize: "52", frSize: "52", letterSize: "4XL" },
  { ukSize: "26", usSize: "22", euSize: "54", frSize: "56", letterSize: "5XL" },
  { ukSize: "28", usSize: "24", euSize: "56", frSize: "58", letterSize: "5XL" },
  { ukSize: "30", usSize: "26", euSize: "6XL", frSize: "6XL", letterSize: "6XL" },
  { ukSize: "32", usSize: "28", euSize: "60", frSize: "62", letterSize: "6XL" },


];

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
export const DEFAULT_UNIT: UmojaLinnSizingTemplate["unit"] = "CM";
export const MAX_IN_USE_TEMPLATES = 3;