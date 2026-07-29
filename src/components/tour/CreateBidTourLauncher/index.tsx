"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setCreateBidTourProjectId,
  shouldAutoStartCreateBidTour,
  shouldAutoStartWelcomeTour,
  hasRecentlyCompletedWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const CREATE_BID_TOUR_START_PATH = "/jobs";

const CreateBidTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const { data: jobsData, isPending } = useGetAllDesignerProject({
    projectStatus: "ADS",
    projectType: "PRIVATE",
    hasBid: false,
  });

  const firstJobId = useMemo(() => {
    const firstJob = jobsData?.data?.data?.[0];

    if (!firstJob?.id) {
      return null;
    }

    return uuidToBase62Safe(firstJob.id);
  }, [jobsData?.data?.data]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.profileRole !== "DESIGNER") {
      return;
    }

    if (isPending || !firstJobId) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartCreateBidTour()) {
      return;
    }

    if (shouldAutoStartWelcomeTour() || hasRecentlyCompletedWelcomeTour()) {
      return;
    }

    if (pathname !== CREATE_BID_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCreateBidTourProjectId(firstJobId);
      startNextStep("create-a-bid");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstJobId,
    isNextStepVisible,
    isPending,
    pathname,
    session?.user?.profileRole,
    startNextStep,
    status,
  ]);

  return null;
};

export default CreateBidTourLauncher;
