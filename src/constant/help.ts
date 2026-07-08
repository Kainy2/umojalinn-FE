import { SUPPORT_EMAIL } from "@/constant/index";

export type THelpCentreActionId =
  | "guided-tours"
  | "chat"
  | "webinars"
  | "demo"
  | "email"
  | "contact";

export type THelpCentreOption = {
  id: THelpCentreActionId;
  label: string;
  showNotificationDot?: boolean;
};

export const DESIGNER_HELP_CENTRE_OPTIONS: THelpCentreOption[] = [
  { id: "guided-tours", label: "Guided Tours" },
  { id: "chat", label: "Chat with Us" },
  { id: "webinars", label: "Bi-weekly Training webinars" },
  { id: "demo", label: "Book a 1:1 Demo" },
  { id: "email", label: "Email our support team", showNotificationDot: true },
];

export const BUYER_HELP_CENTRE_OPTIONS: THelpCentreOption[] = [
  { id: "guided-tours", label: "Guided Tours" },
  { id: "chat", label: "Chat with Us" },
  { id: "demo", label: "Book a 1:1 Demo" },
  { id: "contact", label: "Contact support" },
];

export const HELP_CHAT_URL =
  process.env.NEXT_PUBLIC_HELP_CHAT_URL ?? "";
export const HELP_WEBINAR_URL =
  process.env.NEXT_PUBLIC_HELP_WEBINAR_URL ?? "";
export const HELP_DEMO_URL = process.env.NEXT_PUBLIC_HELP_DEMO_URL ?? "";

export const HELP_SUPPORT_EMAIL = SUPPORT_EMAIL;
