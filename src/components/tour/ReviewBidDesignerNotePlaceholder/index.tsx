"use client";

import { useNextStep } from "nextstepjs";

import {
  REVIEW_BID_DESIGNER_NOTE_STEP_INDEX,
  REVIEW_BID_DESIGNER_NOTE_TARGET_ID,
} from "@/constant/tour/review-bid";

/**
 * Renders a temporary target for the "Designer's Note" step of the review-bid tour
 * when the current bid has no note. It only mounts while that step is active so the
 * tour has something to point at, and unmounts once the user moves past the step.
 */
const ReviewBidDesignerNotePlaceholder = () => {
  const { currentTour, currentStep, isNextStepVisible } = useNextStep();

  const isDesignerNoteStep =
    isNextStepVisible &&
    currentTour === "review-bid" &&
    currentStep === REVIEW_BID_DESIGNER_NOTE_STEP_INDEX;

  if (!isDesignerNoteStep) {
    return null;
  }

  return (
    <div
      id={REVIEW_BID_DESIGNER_NOTE_TARGET_ID}
      className="flex flex-col gap-1 rounded-md border border-dashed border-error/50 bg-error-50/50 p-4"
    >
      <h3 className="font-semibold text-foreground-body">Designer&apos;s Note</h3>
      <p className="text-sm text-foreground-body">
        Any questions, requests, or additional information from the designer will
        appear here.
      </p>
    </div>
  );
};

export default ReviewBidDesignerNotePlaceholder;
