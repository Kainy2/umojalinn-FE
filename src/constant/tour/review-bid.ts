import type { TTourTargetId } from "@/constant/tour/@types";

export type TReviewBidTourTargetId = Extract<
  TTourTargetId,
  | "tour-buyer-bids-tab"
  | "tour-review-bid-milestones"
  | "tour-review-bid-designer-note"
  | "tour-review-bid-delivery-milestone"
  | "tour-review-bid-sizing-template"
  | "tour-review-bid-budget"
  | "tour-review-bid-accept"
>;

export const REVIEW_BID_TOUR_BID_ID_KEY = "umoja-review-bid-tour-bid-id";

export const REVIEW_BID_DESIGNER_NOTE_TARGET_ID: TReviewBidTourTargetId =
  "tour-review-bid-designer-note";

export const REVIEW_BID_DESIGNER_NOTE_STEP_INDEX = 2;

export const REVIEW_BID_SIZING_TEMPLATE_TARGET_ID: TReviewBidTourTargetId =
  "tour-review-bid-sizing-template";

export const REVIEW_BID_SIZING_TEMPLATE_STEP_INDEX = 4;

const tourTarget = (id: TReviewBidTourTargetId) => `#${id}`;

const REVIEW_BID_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildReviewBidTour = (bidId: string) => {
  const bidsPath = "/projects/bids";
  const bidDetailPath = `/bids/${bidId}`;

  return {
    tour: "review-bid" as const,
    steps: [
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Designer Bids",
        content:
          "This is where all designer bids appear. Let's review one together.",
        selector: tourTarget("tour-buyer-bids-tab"),
        side: "bottom" as const,
        nextRoute: bidDetailPath,
      },
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Milestones",
        content:
          "Designers divide your project into milestones. Review each milestone carefully to understand what's included before accepting the bid.",
        selector: tourTarget("tour-review-bid-milestones"),
        side: "right" as const,
        prevRoute: bidsPath,
      },
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Designer's Note",
        content:
          "Any questions, requests, or additional information from the designer will appear here.",
        selector: tourTarget("tour-review-bid-designer-note"),
        side: "bottom" as const,
      },
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Delivery Milestone",
        content:
          "The final milestone will always be delivery. Review milestone details carefully before proceeding.",
        selector: tourTarget("tour-review-bid-delivery-milestone"),
        side: "right" as const,
      },
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Add Sizing Template",
        content:
          "If your sizing details are missing, you will be requested to add them during the bid stage here.",
        selector: tourTarget("tour-review-bid-sizing-template"),
        side: "bottom" as const,
      },
      {
        ...REVIEW_BID_POINTER,
        icon: null,
        title: "Accept or Reject",
        content:
          "Once you've reviewed the bid, choose to accept it and start your project, or reject it if it doesn't meet your requirements.",
        selector: tourTarget("tour-review-bid-accept"),
        side: "top-left" as const,
        prevRoute: bidsPath,
      },
    ],
  };
};
