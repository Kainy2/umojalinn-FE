import { DISPUTE_REASONS } from "@/types/dispute";
import { IProjectDispute } from "./@types";

export const getDisputeReasonLabel = (dispute: IProjectDispute) => {
  if (dispute.reasonLabel) return dispute.reasonLabel;
  if (!dispute.reason) return "";
  return (
    DISPUTE_REASONS.find((item) => item.value === dispute.reason)?.label ?? ""
  );
};

export const formatTimeRemaining = (deadline?: string) => {
  if (!deadline) return null;

  const end = new Date(deadline).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};
