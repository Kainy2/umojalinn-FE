"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import { TOUR_PAGE_READY_EVENT } from "@/components/tour/TourReadyMarker/@types";
import { shouldAutoStartWalletTour, shouldAutoStartWelcomeTour } from "@/lib/tour";

const WALLET_TOUR_START_PATH = "/wallet";

const WalletTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const handlePageReady = (event: Event) => {
      const detail = (event as CustomEvent<{ ready: boolean }>).detail;
      setIsPageReady(detail.ready);
    };

    window.addEventListener(TOUR_PAGE_READY_EVENT, handlePageReady);

    return () => {
      window.removeEventListener(TOUR_PAGE_READY_EVENT, handlePageReady);
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.profileRole !== "DESIGNER") {
      return;
    }

    if (!isPageReady) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartWalletTour()) {
      return;
    }

    if (shouldAutoStartWelcomeTour()) {
      return;
    }

    if (pathname !== WALLET_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      startNextStep("wallet");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    isNextStepVisible,
    isPageReady,
    pathname,
    session?.user?.profileRole,
    startNextStep,
    status,
  ]);

  return null;
};

export default WalletTourLauncher;
