import type { TTourTargetId } from "@/constant/tour/@types";

export type TBuyerSizingTemplateTourTargetId = Extract<
  TTourTargetId,
  | "tour-sidebar-sizing-templates"
  | "tour-sizing-template-card"
  | "tour-buyer-sizing-template-actions"
>;

const tourTarget = (id: TBuyerSizingTemplateTourTargetId) => `#${id}`;

const SIZING_TEMPLATE_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildBuyerSizingTemplateTour = (templateId: string) => {
  const templateDetailPath = `/sizing-templates/${templateId}`;

  return {
    tour: "sizing-template" as const,
    steps: [
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Manage Sizing Templates",
        content:
          "Create, view, and manage your sizing templates. Each template displays its current status so you always know if an action is required.",
        selector: tourTarget("tour-sidebar-sizing-templates"),
        side: "right" as const,
        nextRoute: "/sizing-templates",
      },
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Track Template Status",
        content:
          "Each sizing template card displays its current status. Click on a template card to open and manage it.",
        selector: tourTarget("tour-sizing-template-card"),
        side: "bottom" as const,
        prevRoute: "/sizing-templates",
        nextRoute: templateDetailPath,
      },
      {
        ...SIZING_TEMPLATE_POINTER,
        icon: null,
        title: "Edit, Save, & Attach Your Measurements",
        content:
          "Save your sizing template for later, or choose 'Add to Job' to attach it directly to an active project.",
        selector: tourTarget("tour-buyer-sizing-template-actions"),
        side: "top-left" as const,
        prevRoute: "/sizing-templates",
      },
    ],
  };
};
