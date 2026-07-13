"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setActiveProjectsTourProjectId,
  shouldAutoStartActiveProjectsTour,
  shouldAutoStartCreateProjectTour,
  shouldAutoStartReviewBidTour,
  shouldAutoStartSizingTemplateTour,
  shouldAutoStartWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import type { UmojaLinnSizingTemplate } from "@/types/project";

const BUYER_ACTIVE_PROJECTS_TOUR_START_PATH = "/projects";

const pickBuyerSizingTemplate = (
  templates: UmojaLinnSizingTemplate[] | undefined,
) => {
  if (!templates?.length) {
    return null;
  }

  return (
    templates.find((template) => template.status === "DRAFT") ??
    templates.find((template) => template.status !== "IN_USE") ??
    templates[0]
  );
};

const BuyerActiveProjectsTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const { data: liveProjectsData, isPending: isLiveProjectsPending } =
    useGetAllBuyerProject(
      { projectStatus: "LIVE" },
      { enabled: session?.user?.profileRole === "BUYER" },
    );

  const { data: buyerDraftProjectsData } = useGetAllBuyerProject(
    { projectStatus: "DRAFT" },
    { enabled: session?.user?.profileRole === "BUYER" },
  );

  const { data: buyerPendingBidsData } = useGetBuyerBids(
    { bidStatus: ["PENDING"] },
    { enabled: session?.user?.profileRole === "BUYER" },
  );

  const { data: buyerSizingTemplatesData } = useGetAllSizingTemplates(
    undefined,
    { enabled: session?.user?.profileRole === "BUYER" },
  );

  const firstLiveProjectId = useMemo(() => {
    const firstProject = liveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [liveProjectsData?.data?.data]);

  const hasBuyerDraftProject = !!buyerDraftProjectsData?.data?.data?.[0]?.id;
  const hasPendingBid = !!buyerPendingBidsData?.data?.data?.[0]?.id;
  const hasBuyerSizingTemplate = !!pickBuyerSizingTemplate(
    buyerSizingTemplatesData?.data?.data,
  )?.id;

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (session?.user?.profileRole !== "BUYER") {
      return;
    }

    if (isLiveProjectsPending || !firstLiveProjectId) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartActiveProjectsTour()) {
      return;
    }

    if (shouldAutoStartWelcomeTour()) {
      return;
    }

    if (shouldAutoStartCreateProjectTour() && hasBuyerDraftProject) {
      return;
    }

    if (shouldAutoStartReviewBidTour() && hasPendingBid) {
      return;
    }

    if (shouldAutoStartSizingTemplateTour() && hasBuyerSizingTemplate) {
      return;
    }

    if (pathname !== BUYER_ACTIVE_PROJECTS_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveProjectsTourProjectId(firstLiveProjectId);
      startNextStep("active-projects");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstLiveProjectId,
    hasBuyerDraftProject,
    hasBuyerSizingTemplate,
    hasPendingBid,
    isLiveProjectsPending,
    isNextStepVisible,
    pathname,
    session?.user?.profileRole,
    startNextStep,
    status,
  ]);

  return null;
};

export default BuyerActiveProjectsTourLauncher;
