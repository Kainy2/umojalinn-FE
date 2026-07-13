"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  setSizingTemplateTourProjectId,
  setSizingTemplateTourTemplateId,
  shouldAutoStartCreateProjectTour,
  shouldAutoStartReviewBidTour,
  shouldAutoStartSizingTemplateTour,
  shouldAutoStartWelcomeTour,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import {
  useGetAllDesignerSizingTemplates,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";
import type { UmojaLinnSizingTemplate } from "@/types/project";

const SIZING_TEMPLATE_TOUR_START_PATH = "/sizing-templates";

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

const SizingTemplateTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDesigner = session?.user?.profileRole === "DESIGNER";
  const isBuyer = session?.user?.profileRole === "BUYER";

  const { data: designerTemplatesData, isPending: isDesignerTemplatesPending } =
    useGetAllDesignerSizingTemplates({
      enabled: isDesigner,
    });

  const { data: buyerTemplatesData, isPending: isBuyerTemplatesPending } =
    useGetAllSizingTemplates(undefined, {
      enabled: isBuyer,
    });

  const { data: buyerDraftProjectsData } = useGetAllBuyerProject(
    { projectStatus: "DRAFT" },
    { enabled: isBuyer },
  );

  const { data: buyerPendingBidsData } = useGetBuyerBids(
    { bidStatus: ["PENDING"] },
    { enabled: isBuyer },
  );

  const firstDesignerTemplateContext = useMemo(() => {
    const firstTemplate = designerTemplatesData?.data?.data?.[0];

    if (!firstTemplate?.id) {
      return null;
    }

    const activeProject =
      firstTemplate.projects?.find((project) => project.status !== "COMPLETED") ??
      firstTemplate.projects?.[0];

    if (!activeProject?.id) {
      return null;
    }

    return {
      templateId: uuidToBase62Safe(firstTemplate.id),
      projectId: uuidToBase62Safe(activeProject.id),
    };
  }, [designerTemplatesData?.data?.data]);

  const firstBuyerTemplateId = useMemo(() => {
    const template = pickBuyerSizingTemplate(buyerTemplatesData?.data?.data);

    if (!template?.id) {
      return null;
    }

    return uuidToBase62Safe(template.id);
  }, [buyerTemplatesData?.data?.data]);

  const hasBuyerDraftProject = !!buyerDraftProjectsData?.data?.data?.[0]?.id;
  const hasPendingBid = !!buyerPendingBidsData?.data?.data?.[0]?.id;

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (!isDesigner && !isBuyer) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartSizingTemplateTour()) {
      return;
    }

    if (shouldAutoStartWelcomeTour()) {
      return;
    }

    if (isBuyer) {
      if (
        shouldAutoStartCreateProjectTour() &&
        hasBuyerDraftProject
      ) {
        return;
      }

      if (shouldAutoStartReviewBidTour() && hasPendingBid) {
        return;
      }

      if (isBuyerTemplatesPending || !firstBuyerTemplateId) {
        return;
      }
    }

    if (isDesigner) {
      if (isDesignerTemplatesPending || !firstDesignerTemplateContext) {
        return;
      }
    }

    if (pathname !== SIZING_TEMPLATE_TOUR_START_PATH) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (isDesigner && firstDesignerTemplateContext) {
        setSizingTemplateTourTemplateId(firstDesignerTemplateContext.templateId);
        setSizingTemplateTourProjectId(firstDesignerTemplateContext.projectId);
      }

      if (isBuyer && firstBuyerTemplateId) {
        setSizingTemplateTourTemplateId(firstBuyerTemplateId);
      }

      startNextStep("sizing-template");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    firstBuyerTemplateId,
    firstDesignerTemplateContext,
    hasBuyerDraftProject,
    hasPendingBid,
    isBuyer,
    isBuyerTemplatesPending,
    isDesigner,
    isDesignerTemplatesPending,
    isNextStepVisible,
    pathname,
    startNextStep,
    status,
  ]);

  return null;
};

export default SizingTemplateTourLauncher;
