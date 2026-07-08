"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import { shouldAutoStartWelcomeTour } from "@/lib/tour";

const DESIGNER_WELCOME_TOUR_START_PATHS = ["/dashboard", "/"];
const BUYER_WELCOME_TOUR_START_PATHS = ["/projects", "/"];

const TourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const profileRole = session?.user?.profileRole;

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const isDesigner = profileRole === "DESIGNER";
    const isBuyer = profileRole === "BUYER";

    if (!isDesigner && !isBuyer) {
      return;
    }

    if (isNextStepVisible || !shouldAutoStartWelcomeTour()) {
      return;
    }

    const startPaths = isDesigner
      ? DESIGNER_WELCOME_TOUR_START_PATHS
      : BUYER_WELCOME_TOUR_START_PATHS;

    const isWelcomePath = startPaths.some((path) => pathname === path);

    if (!isWelcomePath) {
      return;
    }

    const timer = window.setTimeout(() => {
      startNextStep("welcome");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [isNextStepVisible, pathname, profileRole, startNextStep, status]);

  return null;
};

export default TourLauncher;
