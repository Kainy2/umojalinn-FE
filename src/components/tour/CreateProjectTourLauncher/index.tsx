"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setCreateProjectTourProjectId,
  shouldAutoStartCreateProjectTour,
  shouldAutoStartWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";

const CREATE_PROJECT_TOUR_START_PATH =
  /^\/project\/[A-Za-z0-9]{20,25}$/;

const CreateProjectTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const { data: draftsData, isPending } = useGetAllBuyerProject(
    { projectStatus: "DRAFT" },
    { enabled: session?.user?.profileRole === "BUYER" },
  );

  const firstDraftId = useMemo(() => {
    const firstDraft = draftsData?.data?.data?.[0];

    if (!firstDraft?.id) {
      return null;
    }

    return uuidToBase62Safe(firstDraft.id);
  }, [draftsData?.data?.data]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.profileRole !== "BUYER") {
      return;
    }

    if (isPending || !firstDraftId) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartCreateProjectTour()) {
      return;
    }

    if (shouldAutoStartWelcomeTour()) {
      return;
    }

    if (!CREATE_PROJECT_TOUR_START_PATH.test(pathname)) {
      return;
    }

    const pathProjectId = pathname.split("/").pop();

    if (pathProjectId !== firstDraftId) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCreateProjectTourProjectId(firstDraftId);
      startNextStep("create-a-project");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstDraftId,
    isNextStepVisible,
    isPending,
    pathname,
    session?.user?.profileRole,
    startNextStep,
    status,
  ]);

  return null;
};

export default CreateProjectTourLauncher;
