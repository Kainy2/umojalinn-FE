"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setReviewBidTourBidId,
  shouldAutoStartCreateProjectTour,
  shouldAutoStartReviewBidTour,
  shouldAutoStartWelcomeTour,
  hasRecentlyCompletedWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";

const REVIEW_BID_TOUR_START_PATH = "/projects/bids";

const ReviewBidTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { data: meResponse, isPending: isUserPending } = useGetMe();
  const user = meResponse?.data?.data;

  const { data: bidsData, isPending } = useGetBuyerBids(
    { bidStatus: ["PENDING"] },
    { enabled: session?.user?.profileRole === "BUYER" },
  );

  const firstPendingBidId = useMemo(() => {
    const firstBid = bidsData?.data?.data?.[0];

    if (!firstBid?.id) {
      return null;
    }

    return uuidToBase62Safe(firstBid.id);
  }, [bidsData?.data?.data]);

  useEffect(() => {
    if (status !== "authenticated" || isUserPending || !user) {
      return;
    }

    if (session?.user?.profileRole !== "BUYER") {
      return;
    }

    if (isPending || !firstPendingBidId) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartReviewBidTour(user)) {
      return;
    }

    if (
      shouldAutoStartWelcomeTour(user) ||
      shouldAutoStartCreateProjectTour(user) ||
      hasRecentlyCompletedWelcomeTour()
    ) {
      return;
    }

    if (pathname !== REVIEW_BID_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      setReviewBidTourBidId(firstPendingBidId);
      startNextStep("review-bid");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstPendingBidId,
    isNextStepVisible,
    isPending,
    pathname,
    session?.user?.profileRole,
    startNextStep,
    status,
    isUserPending,
    user,
  ]);

  return null;
};

export default ReviewBidTourLauncher;
