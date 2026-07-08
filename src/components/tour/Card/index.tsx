"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNextStep } from "nextstepjs";

import type { TTourCardProps } from "@/components/tour/Card/@types";
import { createBidForTour } from "@/lib/create-bid-tour";
import { getCreateBidTourProjectId, setCreateBidTourBidId } from "@/lib/tour";
import { cn } from "@/lib/utils";

const TourCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: TTourCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { closeNextStep, currentTour } = useNextStep();
  const [isAdvancing, setIsAdvancing] = useState(false);

  const isBuyer = session?.user?.profileRole === "BUYER";

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const stepNumber = currentStep + 1;

  const isCreateProjectFinalStep =
    currentTour === "create-a-project" && isLastStep;

  const handleNext = async () => {
    if (isCreateProjectFinalStep) {
      nextStep();
      router.push("/project/create");
      return;
    }

    if (
      currentTour === "create-a-bid" &&
      currentStep === 1 &&
      step.selector === "#tour-create-bid-button"
    ) {
      const projectId = getCreateBidTourProjectId();

      if (!projectId) {
        nextStep();
        return;
      }

      try {
        setIsAdvancing(true);
        const bidId = await createBidForTour(projectId);
        setCreateBidTourBidId(bidId);
        router.push(`/bids/${bidId}/edit`);
        window.setTimeout(() => nextStep(), 500);
      } catch {
        nextStep();
      } finally {
        setIsAdvancing(false);
      }

      return;
    }

    nextStep();
  };

  return (
    <div className="relative box-border w-[min(100vw-2rem,22rem)] min-w-[16rem] rounded-xl bg-background p-5 shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1" />
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {stepNumber}/{totalSteps}
          </span>
          <button
            type="button"
            aria-label="Close tour"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => {
              if (skipTour) {
                skipTour();
                return;
              }

              closeNextStep();
            }}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <h3 className="mb-2 text-base font-bold text-foreground">{step.title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-foreground-body">
        {step.content}
      </p>

      <div className="flex items-center justify-between gap-3">
        {isFirstStep ? (
          <button
            type="button"
            className="text-sm font-medium p-2 text-[#009FE2] border-[#00000033] border rounded-lg"
            onClick={skipTour}
          >
            Skip tour
          </button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevStep}
            className="text-base font-medium p-2 text-[#475467] border-[#00000033] border rounded-lg"
          >
            Previous
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          loading={isAdvancing}
          className={cn(
            isFirstStep && "ml-auto",
            "text-base font-semibold py-2 px-4 bg-[#CA8504] rounded-lg",
          )}
          onClick={handleNext}
        >
          {isLastStep
            ? isCreateProjectFinalStep
              ? "Create your first project"
              : currentTour === "review-bid" ||
                  (currentTour === "sizing-template" && isBuyer)
                ? "Done"
                : "Finish"
            : "Next"}
        </Button>
      </div>

      {arrow}
    </div>
  );
};

export default TourCard;
