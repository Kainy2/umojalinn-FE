import type { TTourTargetId } from "@/constant/tour/@types";

export type TBuyerActiveProjectsTourTargetId = Extract<
  TTourTargetId,
  | "tour-buyer-projects-tabs"
  | "tour-active-project-card"
  | "tour-active-project-milestone-timeline"
  | "tour-active-project-fund"
  | "tour-active-project-milestone-approval"
  | "tour-active-project-delivery-milestone"
  | "tour-active-project-escrow"
  | "tour-active-project-tabs"
  | "tour-active-project-sizing-template"
>;

export const BUYER_ACTIVE_PROJECTS_TOUR_NAME = "active-projects" as const;

export const BUYER_ACTIVE_PROJECTS_FUND_TARGET_ID: TBuyerActiveProjectsTourTargetId =
  "tour-active-project-fund";

export const BUYER_ACTIVE_PROJECTS_FUND_STEP_INDEX = 3;

export const BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_TARGET_ID: TBuyerActiveProjectsTourTargetId =
  "tour-active-project-milestone-approval";

export const BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_STEP_INDEX = 4;

const tourTarget = (id: TBuyerActiveProjectsTourTargetId) => `#${id}`;

const ACTIVE_PROJECTS_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildBuyerActiveProjectsTour = (projectId: string) => {
  const projectsPath = "/projects";
  const projectDetailPath = `/projects/${projectId}`;

  return {
    tour: "active-projects" as const,
    steps: [
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Welcome to your Active Project",
        content:
          "Track your outfit progress, manage payments, approve deliveries, and chat with your designer from here.",
        selector: tourTarget("tour-buyer-projects-tabs"),
        side: "bottom" as const,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Switch between projects",
        content:
          "Click on any project card to view the full project details. Each project keeps its own milestones, chat, escrow, files, and timeline.",
        selector: tourTarget("tour-active-project-card"),
        side: "bottom" as const,
        prevRoute: projectsPath,
        nextRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Milestones",
        content:
          "Your project is divided into milestones. Each milestone represents a stage of work and helps you track your outfit progress.",
        selector: tourTarget("tour-active-project-milestone-timeline"),
        side: "top" as const,
        prevRoute: projectsPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Funding",
        content:
          "Fund milestones individually as your project progresses, or fund the entire project upfront. A milestone must be funded before your designer can begin work.",
        selector: tourTarget("tour-active-project-fund"),
        side: "bottom" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Milestone Approval",
        content:
          "When your designer submits a completed milestone, review it carefully. Approve it to release payment or reject to send it back with feedback.",
        selector: tourTarget("tour-active-project-milestone-approval"),
        side: "top" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Variable Delivery",
        content:
          "If a delivery milestone uses Variable Delivery, you will need to approve the final delivery method and price before a designer can complete it.",
        selector: tourTarget("tour-active-project-delivery-milestone"),
        side: "top" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Secure Project Payments",
        content:
          "Track milestone payments, escrow balances, and invoices. Funds remain securely held until you approve each completed milestone.",
        selector: tourTarget("tour-active-project-escrow"),
        side: "left" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Activities, Chat & Media",
        content:
          "Stay informed with project updates in Activities, communicate with your designer directly in Chat, and view shared files in Media & links.",
        selector: tourTarget("tour-active-project-tabs"),
        side: "top" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Sizing Template",
        content:
          "Sizing template statuses are displayed here. Keep an eye out for any actions you may need to take on your sizing template!",
        selector: tourTarget("tour-active-project-sizing-template"),
        side: "right" as const,
        prevRoute: projectDetailPath,
      },
    ],
  };
};
