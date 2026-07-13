"use client";

import { useNextStep } from "nextstepjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_STEP_INDEX,
  BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_TARGET_ID,
  BUYER_ACTIVE_PROJECTS_TOUR_NAME,
} from "@/constant/tour/active-projects-buyer";

/**
 * Renders a read-only replica of the buyer milestone approval actions as a
 * temporary target for the Milestone Approval step of the active-projects
 * tour, used when no milestone is currently in review. It only mounts while
 * that step is active so the tour has something to point at.
 */
const ActiveProjectMilestoneApprovalPlaceholder = () => {
  const { currentTour, currentStep, isNextStepVisible } = useNextStep();

  const isMilestoneApprovalStep =
    isNextStepVisible &&
    currentTour === BUYER_ACTIVE_PROJECTS_TOUR_NAME &&
    currentStep === BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_STEP_INDEX;

  if (!isMilestoneApprovalStep) {
    return null;
  }

  return (
    <div className="mt-2 animate-in fade-in duration-300">
      <Separator className="my-3" />
      <div
        id={BUYER_ACTIVE_PROJECTS_MILESTONE_APPROVAL_TARGET_ID}
        className="flex gap-4 flex-col md:flex-row"
      >
        <Button size="sm" variant="outline" fullWidth disabled>
          Reject
        </Button>
        <Button size="sm" variant="success" fullWidth disabled>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default ActiveProjectMilestoneApprovalPlaceholder;
