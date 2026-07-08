import type { TTourTargetId } from "@/constant/tour/@types";

export type TSizingTemplateTourTargetId = Extract<
  TTourTargetId,
  | "tour-sidebar-sizing-templates"
  | "tour-sizing-template-card"
  | "tour-sizing-template-measurement-points"
>;

export const SIZING_TEMPLATE_TOUR_TEMPLATE_ID_KEY =
  "umoja-sizing-template-tour-template-id";
export const SIZING_TEMPLATE_TOUR_PROJECT_ID_KEY =
  "umoja-sizing-template-tour-project-id";

const tourTarget = (id: TSizingTemplateTourTargetId) => `#${id}`;

const SIZING_TEMPLATE_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildSizingTemplateTour = (
  templateId: string,
  projectId: string,
) => {
  const templateDetailPath = `/sizing-templates/${templateId}?projectId=${projectId}`;

  return {
    tour: "sizing-template" as const,
    steps: [
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Client Sizing Templates",
        content: "Manage sizing template linked to your projects.",
        selector: tourTarget("tour-sidebar-sizing-templates"),
        side: "right" as const,
        nextRoute: "/sizing-templates",
      },
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Track Template Status",
        content:
          "Each sizing template card displays its current status so you always know if an action is required. Click on a template card to open and manage it.",
        selector: tourTarget("tour-sizing-template-card"),
        side: "bottom" as const,
        prevRoute: "/sizing-templates",
        nextRoute: templateDetailPath,
      },
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Request the measurements you need.",
        content:
          "You can select the specific measurement points you need for the job.",
        selector: tourTarget("tour-sizing-template-measurement-points"),
        side: "right" as const,
        prevRoute: "/sizing-templates",
      },
    ],
  };
};
