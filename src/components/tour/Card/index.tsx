"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNextStep } from "nextstepjs";

import type { TTourCardProps } from "@/components/tour/Card/@types";
import { createBidForTour } from "@/lib/create-bid-tour";
import {
  dispatchCreateBidRequestMeasurements,
  dispatchCreateBidSaveMilestone,
  dispatchTourMobileMenuOpen,
  ensureMobileMenuForTourSelector,
  getCreateBidTourProjectId,
  getTourStepAt,
  isTourMobileViewport,
  setCreateBidTourBidId,
  syncTourPointerToTarget,
  waitForTourSelector,
} from "@/lib/tour";
import { cn } from "@/lib/utils";

const TOUR_CARD_VIEWPORT_MARGIN_PX = 16;
const TOUR_CARD_MAX_WIDTH_PX = 22 * 16; // 22rem

const resetTourCardPosition = (el: HTMLElement) => {
  el.style.position = "";
  el.style.left = "";
  el.style.right = "";
  el.style.top = "";
  el.style.width = "";
  el.style.maxWidth = "";
  el.style.minWidth = "";
  el.style.transform = "";
  el.style.zIndex = "";
  el.style.margin = "";
  el.style.boxSizing = "";
  // Do NOT touch the parent — nextstepjs owns its transform/position for
  // desktop pointer placement. Clearing it was causing the card to snap to (0,0).
};

/**
 * Escape nextstepjs absolute/motion placement so the card stays on-screen.
 *
 * nextstep mounts the card inside a motion pointer that uses transforms.
 * That makes `position: fixed` relative to the pointer box.
 * We measure the containing-block origin via getBoundingClientRect so the
 * desiredLeft/Top offset math is correct regardless of the parent's transform.
 * We deliberately do NOT touch the parent element — nextstepjs owns its
 * transform for desktop pointer placement, and overriding it causes the card
 * to snap to (0,0) on desktop when the effect resets.
 */
const placeTourCardInViewport = (
  el: HTMLElement,
  selector?: string | null,
) => {
  const margin = TOUR_CARD_VIEWPORT_MARGIN_PX;
  const width = Math.min(
    window.innerWidth - margin * 2,
    TOUR_CARD_MAX_WIDTH_PX,
  );

  el.style.position = "fixed";
  el.style.right = "auto";
  el.style.width = `${width}px`;
  el.style.maxWidth = `${width}px`;
  el.style.minWidth = "0";
  el.style.transform = "none";
  el.style.zIndex = "210";
  el.style.margin = "0";
  el.style.boxSizing = "border-box";

  // Local (0,0) under the transformed pointer → viewport origin.
  el.style.left = "0px";
  el.style.top = "0px";
  const origin = el.getBoundingClientRect();

  const target = selector ? document.querySelector(selector) : null;
  const cardHeight = el.offsetHeight;
  const maxTop = Math.max(margin, window.innerHeight - cardHeight - margin);
  const desiredLeft = Math.max(
    margin,
    (window.innerWidth - width) / 2,
  );
  let desiredTop = margin;

  if (target) {
    const targetRect = target.getBoundingClientRect();
    const below = targetRect.bottom + margin;
    const above = targetRect.top - cardHeight - margin;

    if (below <= maxTop) {
      desiredTop = below;
    } else if (above >= margin) {
      desiredTop = above;
    } else {
      desiredTop = Math.min(Math.max(margin, below), maxTop);
    }
  } else {
    desiredTop = Math.max(margin, (window.innerHeight - cardHeight) / 2);
  }

  desiredTop = Math.min(Math.max(margin, desiredTop), maxTop);

  el.style.left = `${desiredLeft - origin.left}px`;
  el.style.top = `${desiredTop - origin.top}px`;
};

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
  const { closeNextStep, currentTour, setCurrentStep } = useNextStep();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isBuyer = session?.user?.profileRole === "BUYER";

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const stepNumber = currentStep + 1;

  const isCreateProjectFinalStep =
    currentTour === "create-a-project" && isLastStep;

  // nextstepjs anchors the card to the highlight with absolute + transform.
  // On mobile that routinely hangs off-screen (esp. appbar bottom-right).
  // Pin the card to the viewport instead; desktop keeps library positioning.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) {
      return;
    }

    const syncPlacement = () => {
      const mobile = isTourMobileViewport();
      setIsMobileViewport(mobile);

      if (!mobile) {
        resetTourCardPosition(el);
        return;
      }

      placeTourCardInViewport(el, step.selector);
    };

    syncPlacement();

    // nextstep animates the pointer after the step index changes — re-place
    // once after the frame and once after the card transition settles.
    const rafId = window.requestAnimationFrame(syncPlacement);
    const timeoutId = window.setTimeout(syncPlacement, 320);

    window.addEventListener("resize", syncPlacement);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", syncPlacement);
      resetTourCardPosition(el);
    };
  }, [currentStep, step.selector, step.side]);

  const advanceWithRoute = async (direction: "next" | "prev") => {
    const route = direction === "next" ? step.nextRoute : step.prevRoute;
    const targetIndex =
      direction === "next" ? currentStep + 1 : currentStep - 1;
    const targetSelector = getTourStepAt(currentTour, targetIndex)?.selector;

    setIsAdvancing(true);
    try {
      // Sidebar targets only exist in the mobile hamburger Drawer — open/close
      // it before waiting so waitForTourSelector does not time out.
      await ensureMobileMenuForTourSelector(targetSelector);

      if (!route) {
        if (direction === "next") {
          nextStep();
        } else {
          prevStep();
        }

        if (targetSelector) {
          syncTourPointerToTarget(targetSelector);
        }
        return;
      }

      // Sidebar/appbar targets are already mounted — highlight immediately and
      // let the page navigate underneath (no MutationObserver wait).
      const targetAlreadyInDom =
        !!targetSelector && !!document.querySelector(targetSelector);

      router.push(route);

      if (!targetAlreadyInDom && targetSelector) {
        await waitForTourSelector(targetSelector);
      }

      setCurrentStep(targetIndex);

      // The destination page keeps mounting/loading after the target first
      // appears, so keep the spotlight glued to the target while it settles.
      if (targetSelector) {
        syncTourPointerToTarget(targetSelector);
      }
    } finally {
      setIsAdvancing(false);
    }
  };

  const handlePrev = () => {
    void advanceWithRoute("prev");
  };

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
        await advanceWithRoute("next");
        return;
      }

      try {
        setIsAdvancing(true);
        const bidId = await createBidForTour(projectId);
        setCreateBidTourBidId(bidId);
        router.push(`/bids/${bidId}/edit`);
        await waitForTourSelector("#tour-create-bid-milestone-fields");
        setCurrentStep(currentStep + 1);
        syncTourPointerToTarget("#tour-create-bid-milestone-fields");
      } catch {
        await advanceWithRoute("next");
      } finally {
        setIsAdvancing(false);
      }

      return;
    }

    if (
      currentTour === "create-a-bid" &&
      step.selector === "#tour-create-bid-milestone-fields"
    ) {
      try {
        setIsAdvancing(true);
        await dispatchCreateBidSaveMilestone();
      } finally {
        setIsAdvancing(false);
      }
      await advanceWithRoute("next");
      return;
    }

    if (
      currentTour === "create-a-bid" &&
      step.selector === "#tour-create-bid-measurement-points"
    ) {
      try {
        setIsAdvancing(true);
        await dispatchCreateBidRequestMeasurements();
      } finally {
        setIsAdvancing(false);
      }
      await advanceWithRoute("next");
      return;
    }

    await advanceWithRoute("next");
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative box-border w-[min(100vw-2rem,22rem)] max-w-[calc(100vw-2rem)] rounded-xl bg-background p-5 shadow-lg",
        "max-md:min-w-0 md:min-w-[16rem]",
      )}
    >
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
              dispatchTourMobileMenuOpen(false);
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        {isFirstStep ? (
          <button
            type="button"
            className="shrink-0 text-sm font-medium p-2 text-[#009FE2] border-[#00000033] border rounded-lg"
            onClick={skipTour}
          >
            Skip tour
          </button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="shrink-0 text-base font-medium p-2 text-[#475467] border-[#00000033] border rounded-lg"
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
            "shrink-0 text-base font-semibold py-2 px-4 bg-[#CA8504] rounded-lg",
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

      {/* Arrow is tied to nextstep absolute placement; skip on mobile fixed card. */}
      {!isMobileViewport && arrow}
    </div>
  );
};

export default TourCard;
