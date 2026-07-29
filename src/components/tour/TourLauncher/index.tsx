"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import { shouldAutoStartWelcomeTour } from "@/lib/tour";
import { useGetMe } from "@/tanstack/hooks/useUser";

const DESIGNER_WELCOME_TOUR_START_PATHS = ["/dashboard", "/"];
const BUYER_WELCOME_TOUR_START_PATHS = ["/projects", "/"];

const TourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const { data: meResponse, isPending } = useGetMe();
  const user = meResponse?.data?.data;
  const pathname = usePathname();
  const profileRole = session?.user?.profileRole;

  useEffect(() => {
    if (status !== "authenticated" || isPending || !user) {
      return;
    }

    const isDesigner = profileRole === "DESIGNER";
    const isBuyer = profileRole === "BUYER";

    if (!isDesigner && !isBuyer) {
      return;
    }

    if (isNextStepVisible || !shouldAutoStartWelcomeTour(user)) {
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
  }, [isNextStepVisible, pathname, profileRole, startNextStep, status, isPending, user]);

  return null;
};

export default TourLauncher;
