export const DISPUTE_REASONS = [
  {
    value: "UNABLE_TO_COMPLETE",
    label: "Unable to complete the work",
  },
  {
    value: "DELAY_TIMELINE_ISSUES",
    label: "Delay / timeline issues",
  },
  {
    value: "CLIENT_CHANGES_OUTSIDE_SCOPE",
    label: "Client requesting changes outside scope",
  },
  { value: "OTHER", label: "Other" },
] as const;

export type TDisputeReason = (typeof DISPUTE_REASONS)[number]["value"];
