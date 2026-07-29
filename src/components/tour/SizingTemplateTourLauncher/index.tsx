"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import {
  pickBuyerSizingTemplate,
  setSizingTemplateTourProjectId,
  setSizingTemplateTourTemplateId,
  shouldAutoStartSizingTemplateTour,
  shouldAutoStartWelcomeTour,
  hasRecentlyCompletedWelcomeTour,
} from "@/lib/tour";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useGetAllDesignerSizingTemplates,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";

const SIZING_TEMPLATE_TOUR_START_PATH = "/sizing-templates";

const SizingTemplateTourLauncher = () => {
  const { startNextStep, isNextStepVisible } = useNextStep();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDesigner = session?.user?.profileRole === "DESIGNER";
  const isBuyer = session?.user?.profileRole === "BUYER";
  const { data: meResponse, isPending } = useGetMe();
  const user = meResponse?.data?.data;

  const { data: designerTemplatesData, isPending: isDesignerTemplatesPending } =
    useGetAllDesignerSizingTemplates({
      enabled: isDesigner,
    });

  const { data: buyerTemplatesData, isPending: isBuyerTemplatesPending } =
    useGetAllSizingTemplates(undefined, {
      enabled: isBuyer,
    });

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

  const buyerTemplates = buyerTemplatesData?.data?.data;
  const hasBuyerTemplates = !!buyerTemplates?.length;

  const firstBuyerTemplateId = useMemo(() => {
    const template = pickBuyerSizingTemplate(buyerTemplates);

    if (!template?.id) {
      return null;
    }

    return uuidToBase62Safe(template.id);
  }, [buyerTemplates]);

  useEffect(() => {
    if (status !== "authenticated" || isPending || !user) {
      return;
    }

    if (!isDesigner && !isBuyer) {
      return;
    }

    if (isNextStepVisible) {
      return;
    }

    if (!shouldAutoStartSizingTemplateTour(user)) {
      return;
    }

    if (shouldAutoStartWelcomeTour(user) || hasRecentlyCompletedWelcomeTour()) {
      return;
    }

    if (isBuyer) {
      // Steps 1–2 only need any template card; step 3 needs an editable one.
      if (isBuyerTemplatesPending || !hasBuyerTemplates) {
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
    hasBuyerTemplates,
    isBuyer,
    isBuyerTemplatesPending,
    isDesigner,
    isDesignerTemplatesPending,
    isNextStepVisible,
    pathname,
    startNextStep,
    status,
    isPending,
    user,
  ]);

  return null;
};

export default SizingTemplateTourLauncher;
