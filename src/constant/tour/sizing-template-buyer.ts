import type { TTourTargetId } from "@/constant/tour/@types";

export type TBuyerSizingTemplateTourTargetId = Extract<
  TTourTargetId,
  | "tour-sidebar-sizing-templates"
  | "tour-sizing-template-card"
  | "tour-sizing-template-measurement-points"
>;

const tourTarget = (id: TBuyerSizingTemplateTourTargetId) => `#${id}`;

const SIZING_TEMPLATE_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildBuyerSizingTemplateTour = (
  templateId?: string | null,
) => {
  const canEditMeasurements = !!templateId;
  const templateDetailPath = canEditMeasurements
    ? `/sizing-templates/${templateId}`
    : undefined;

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
        side: "right" as const,
        prevRoute: "/sizing-templates",
        ...(templateDetailPath ? { nextRoute: templateDetailPath } : {}),
      },
      ...(canEditMeasurements
        ? [
            {
              ...SIZING_TEMPLATE_POINTER,
              icon: null,
              title: "Edit, Save, & Attach Your Measurements",
              content:
                "Fill in your measurement points, then save your sizing template for later, or choose 'Add to Job' to attach it directly to an active project.",
              selector: tourTarget("tour-sizing-template-measurement-points"),
              side: "right" as const,
              prevRoute: "/sizing-templates",
            },
          ]
        : []),
    ],
  };
};
