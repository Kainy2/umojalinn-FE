"use client";

import { useNextStep } from "nextstepjs";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import NotificationBox from "@/icons/NotificationBox";
import {
  REVIEW_BID_SIZING_TEMPLATE_STEP_INDEX,
  REVIEW_BID_SIZING_TEMPLATE_TARGET_ID,
} from "@/constant/tour/review-bid";

/**
 * Renders a read-only visual replica of the buyer "Sizing Template requested"
 * alert as a temporary target for the "Add Sizing Template" step of the review-bid
 * tour, used when the real alert isn't present (the designer hasn't requested
 * measurements, or a template is already attached). It only mounts while that step
 * is active so the tour has something to point at, and unmounts once the user moves
 * past the step.
 */
const ReviewBidSizingTemplatePlaceholder = () => {
  const { currentTour, currentStep, isNextStepVisible } = useNextStep();

  const isSizingTemplateStep =
    isNextStepVisible &&
    currentTour === "review-bid" &&
    currentStep === REVIEW_BID_SIZING_TEMPLATE_STEP_INDEX;

  if (!isSizingTemplateStep) {
    return null;
  }

  return (
    <div
      id={REVIEW_BID_SIZING_TEMPLATE_TARGET_ID}
      className="flex flex-col lg:flex-row p-3 border rounded-md gap-3 border-yellow-200 bg-yellow-50 lg:items-center mb-8 animate-in fade-in duration-300"
    >
      <span className="size-8 shrink-0 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
        <NotificationBox />
      </span>
      <div className="flex flex-1 flex-col text-sm">
        <h3 className="font-bold text-foreground-body">
          Sizing Template requested!
        </h3>
        <p className="text-muted-foreground">
          To streamline the bidding process, a sizing template has been
          requested.
        </p>
      </div>

      <Button
        disabled
        className="bg-primary hover:bg-primary/90 rounded-md min-w-[180px]"
      >
        Add Sizing template
        <ChevronDown className="size-4 ml-2" />
      </Button>
    </div>
  );
};

export default ReviewBidSizingTemplatePlaceholder;
