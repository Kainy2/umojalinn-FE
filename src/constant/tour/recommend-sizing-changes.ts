import type { TTourTargetId } from "@/constant/tour/@types";

export type TRecommendSizingChangesTourTargetId = Extract<
  TTourTargetId,
  | "tour-recommend-changes-button"
  | "tour-sizing-template-measurement-points"
  | "tour-recommend-measurement-point"
  | "tour-recommend-add-comment"
  | "tour-recommend-delete-comment"
  | "tour-recommend-submit"
>;

const tourTarget = (id: TRecommendSizingChangesTourTargetId) => `#${id}`;

const RECOMMEND_SIZING_CHANGES_POINTER = {
  pointerPadding: 8,
  pointerRadius: 8,
  showControls: true,
  showSkip: true,
};

export const buildRecommendSizingChangesTour = () => ({
  tour: "recommend-sizing-changes" as const,
  steps: [
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "Recommend Measurement Updates",
      content:
        "Once a client provides the requested measurements, if any measurements appear incorrect, you can recommend changes to the specific measurements.",
      selector: tourTarget("tour-recommend-changes-button"),
      side: "top-left" as const,
    },
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "Select Measurement Points",
      content:
        "Select the measurement points you'd like the client to review and update.",
      selector: tourTarget("tour-sizing-template-measurement-points"),
      side: "right" as const,
    },
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "View Measurement Details",
      content:
        "Click anywhere on a measurement point to display the measurement's tutorial illustration and your comments.",
      selector: tourTarget("tour-recommend-measurement-point"),
      side: "right" as const,
    },
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "Add a Comment",
      content:
        "Click the 'add comment' icon to add a comment to a measurement point.",
      selector: tourTarget("tour-recommend-add-comment"),
      side: "right" as const,
    },
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "Delete a Comment",
      content:
        "Click the 'delete' icon to delete a comment from a measurement point.",
      selector: tourTarget("tour-recommend-delete-comment"),
      side: "right" as const,
    },
    {
      ...RECOMMEND_SIZING_CHANGES_POINTER,
      icon: null,
      title: "Don't forget to Submit!",
      content:
        "Submit Changes once you're ready to send your recommendations to the client.",
      selector: tourTarget("tour-recommend-submit"),
      side: "top-right" as const,
    },
  ],
});
