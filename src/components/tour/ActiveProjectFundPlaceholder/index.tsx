"use client";

import { useNextStep } from "nextstepjs";
import { AlertTriangle } from "lucide-react";

import Alert from "@/components/custom/Alert";
import { Button } from "@/components/ui/button";
import {
  BUYER_ACTIVE_PROJECTS_FUND_STEP_INDEX,
  BUYER_ACTIVE_PROJECTS_FUND_TARGET_ID,
  BUYER_ACTIVE_PROJECTS_TOUR_NAME,
} from "@/constant/tour/active-projects-buyer";

/**
 * Renders a read-only replica of the buyer "Awaiting fund" alert as a temporary
 * target for the Funding step of the active-projects tour, used when the real
 * alert isn't present (e.g. the project is already funded). It only mounts while
 * that step is active so the tour has something to point at.
 */
const ActiveProjectFundPlaceholder = () => {
  const { currentTour, currentStep, isNextStepVisible } = useNextStep();

  const isFundStep =
    isNextStepVisible &&
    currentTour === BUYER_ACTIVE_PROJECTS_TOUR_NAME &&
    currentStep === BUYER_ACTIVE_PROJECTS_FUND_STEP_INDEX;

  if (!isFundStep) {
    return null;
  }

  return (
    <div id={BUYER_ACTIVE_PROJECTS_FUND_TARGET_ID}>
      <Alert
        className="w-[90vw] lg:w-[70vw] mb-8 rounded-lg shadow-md shadow-error-700/25"
        type="error"
        icon={<AlertTriangle />}
        title="Awaiting fund"
        message="fund escrow to start project"
        action={
          <div className="flex flex-col md:flex-row gap-1">
            <Button className="w-full md:w-auto" variant="outline" disabled>
              Fund Milestone
            </Button>
            <Button className="w-full md:w-auto" disabled>
              Fund Project
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ActiveProjectFundPlaceholder;
