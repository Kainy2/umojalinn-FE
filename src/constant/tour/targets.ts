import type { TTourTargetId } from "@/constant/tour/@types";

export const SIDEBAR_TOUR_TARGET_IDS: Record<string, TTourTargetId> = {
  Dashboard: "tour-sidebar-dashboard",
  Projects: "tour-sidebar-projects",
  Designers: "tour-sidebar-designers",
  Jobs: "tour-sidebar-jobs",
  "Sizing Templates": "tour-sidebar-sizing-templates",
  Wallet: "tour-sidebar-wallet",
  Escrow: "tour-sidebar-escrow",
  Settings: "tour-sidebar-settings",
  "Share your work": "tour-designer-share-work",
  "Create Project": "tour-buyer-create-project",
};

export const getSidebarTourTargetId = (
  title: string,
): TTourTargetId | undefined => SIDEBAR_TOUR_TARGET_IDS[title];
