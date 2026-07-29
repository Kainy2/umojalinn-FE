"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setActiveProjectsTourProjectId,
  shouldAutoStartActiveProjectsTour,
  shouldAutoStartWelcomeTour,
  hasRecentlyCompletedWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const ACTIVE_PROJECTS_TOUR_START_PATH = "/dashboard";

const ActiveProjectsTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { data: meResponse, isPending: isUserPending } = useGetMe();
  const user = meResponse?.data?.data;

  const { data: liveProjectsData, isPending } = useGetAllDesignerProject({
    projectStatus: "LIVE",
  });

  const firstProjectId = useMemo(() => {
    const firstProject = liveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [liveProjectsData?.data?.data]);

  useEffect(() => {
    if (status !== "authenticated" || isUserPending || !user) {
      return;
    }

    if (session?.user?.profileRole !== "DESIGNER") {
      return;
    }

    if (isPending || !firstProjectId) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartActiveProjectsTour(user)) {
      return;
    }

    if (shouldAutoStartWelcomeTour(user) || hasRecentlyCompletedWelcomeTour()) {
      return;
    }

    if (pathname !== ACTIVE_PROJECTS_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveProjectsTourProjectId(firstProjectId);
      startNextStep("active-projects");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstProjectId,
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

export default ActiveProjectsTourLauncher;
