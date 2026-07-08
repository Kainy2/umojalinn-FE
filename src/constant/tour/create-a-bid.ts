import type { TTourTargetId } from "@/constant/tour/@types";

export type TCreateBidTourTargetId = Extract<
  TTourTargetId,
  | "tour-sidebar-jobs"
  | "tour-create-bid-button"
  | "tour-create-bid-milestone-fields"
  | "tour-create-bid-milestone-payment"
  | "tour-create-bid-delivery-milestone"
  | "tour-create-bid-sizing-template"
  | "tour-create-bid-measurement-points"
  | "tour-create-bid-submit"
>;

export const CREATE_BID_TOUR_PROJECT_ID_KEY =
  "umoja-create-bid-tour-project-id";
export const CREATE_BID_TOUR_BID_ID_KEY = "umoja-create-bid-tour-bid-id";

const tourTarget = (id: TCreateBidTourTargetId) => `#${id}`;

const CREATE_BID_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildCreateBidTour = (
  projectId: string,
  bidId?: string | null,
) => {
  const bidEditPath = bidId ? `/bids/${bidId}/edit` : undefined;
  const requestSizingPath = bidId
    ? `/sizing-templates/request/${bidId}`
    : undefined;

  return {
    tour: "create-a-bid" as const,
    steps: [
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Ready to start your first project?",
        content: "View your available jobs to get started with a bid.",
        selector: tourTarget("tour-sidebar-jobs"),
        side: "right" as const,
        nextRoute: `/jobs/${projectId}`,
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Create Bid",
        content:
          "Click here to start creating your bid for this job when you're ready.",
        selector: tourTarget("tour-create-bid-button"),
        side: "bottom-right" as const,
        prevRoute: "/jobs",
        disableInteraction: true,
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Break your job into milestones",
        content:
          "Each milestone represents a stage in your project and has its own payment.",
        selector: tourTarget("tour-create-bid-milestone-fields"),
        side: "right" as const,
        prevRoute: `/jobs/${projectId}`,
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Every bid ends with a Delivery Milestone",
        content:
          "Carefully select the appropriate delivery method for the job.",
        selector: tourTarget("tour-create-bid-delivery-milestone"),
        side: "right" as const,
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Sizing Template",
        content:
          "Request a sizing template from the client if the project doesn't include one yet.",
        selector: tourTarget("tour-create-bid-sizing-template"),
        side: "bottom-right" as const,
        ...(requestSizingPath ? { nextRoute: requestSizingPath } : {}),
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Request the measurements you need",
        content:
          "You can select the specific measurement points you need for the job.",
        selector: tourTarget("tour-create-bid-measurement-points"),
        side: "right" as const,
        ...(bidEditPath ? { prevRoute: bidEditPath } : {}),
        ...(bidEditPath ? { nextRoute: bidEditPath } : {}),
      },
      {
        ...CREATE_BID_POINTER,
        icon: null,
        title: "Ready to Submit!",
        content:
          "Once you’ve reviewed your bid details, submit your bid for the client to review! Your submitted bids can be found in your Dashboard.",
        selector: tourTarget("tour-create-bid-submit"),
        side: "top-right" as const,
        ...(requestSizingPath ? { prevRoute: requestSizingPath } : {}),
        disableInteraction: true,
      },
    ],
  };
};
