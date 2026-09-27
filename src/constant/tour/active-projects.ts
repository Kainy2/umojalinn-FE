import type { TTourTargetId } from "@/constant/tour/@types";

export type TActiveProjectsTourTargetId = Extract<
  TTourTargetId,
  | "tour-active-project-jobs-column"
  | "tour-active-project-milestone"
  | "tour-active-project-delivery-milestone"
  | "tour-active-project-escrow"
  | "tour-active-project-tabs"
  | "tour-active-project-sizing-template"
>;

export const ACTIVE_PROJECTS_TOUR_PROJECT_ID_KEY =
  "umoja-active-projects-tour-project-id";

const tourTarget = (id: TActiveProjectsTourTargetId) => `#${id}`;

const ACTIVE_PROJECTS_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildActiveProjectsTour = (projectId: string) => {
  const projectDetailPath = `/active-jobs/${projectId}`;
  const dashboardPath = "/dashboard";

  return {
    tour: "active-projects" as const,
    steps: [
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Manage your active jobs",
        content:
          "All your ongoing jobs will be listed here. Review and manage your work with your clients.",
        selector: tourTarget("tour-active-project-jobs-column"),
        side: "top" as const,
        nextRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Complete Project milestone",
        content:
          "Only the active milestone can be edited. Add progress updates and images, then submit the milestone for your client to review.",
        selector: tourTarget("tour-active-project-milestone"),
        side: "top" as const,
        prevRoute: dashboardPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Delivery Milestone",
        content:
          "For variable delivery, you'll be able to submit the final delivery method and price for approval before the milestone can be completed.",
        selector: tourTarget("tour-active-project-delivery-milestone"),
        side: "top" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Project Escrow",
        content:
          "Track payments released for completed milestones and see the remaining escrow balance that will be paid as work progresses.",
        selector: tourTarget("tour-active-project-escrow"),
        side: "left" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Activities, Chat & Media",
        content:
          "Stay informed with project updates in Activities, communicate with your client directly in Chat, and view shared files in Media & links.",
        selector: tourTarget("tour-active-project-tabs"),
        side: "top" as const,
        prevRoute: projectDetailPath,
      },
      {
        ...ACTIVE_PROJECTS_POINTER,
        icon: null,
        title: "Sizing Template",
        content:
          "Sizing template statuses are displayed here. Keep an eye for any actions you may need to take on your clients sizing template!",
        selector: tourTarget("tour-active-project-sizing-template"),
        side: "right" as const,
        prevRoute: projectDetailPath,
      },
    ],
  };
};
