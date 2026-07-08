"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NextStep, NextStepProvider } from "nextstepjs";
import { useSession } from "next-auth/react";

import TourCard from "@/components/tour/Card";
import BuyerActiveProjectsTourLauncher from "@/components/tour/BuyerActiveProjectsTourLauncher";
import ActiveProjectsTourLauncher from "@/components/tour/ActiveProjectsTourLauncher";
import CreateBidTourLauncher from "@/components/tour/CreateBidTourLauncher";
import CreateProjectTourLauncher from "@/components/tour/CreateProjectTourLauncher";
import ReviewBidTourLauncher from "@/components/tour/ReviewBidTourLauncher";
import SizingTemplateTourLauncher from "@/components/tour/SizingTemplateTourLauncher";
import TourLauncher from "@/components/tour/TourLauncher";
import WalletTourLauncher from "@/components/tour/WalletTourLauncher";
import WelcomeComplete from "@/components/tour/WelcomeComplete";
import type { TTourName } from "@/constant/tour/@types";
import { buildActiveProjectsTour } from "@/constant/tour/active-projects";
import { buildBuyerActiveProjectsTour } from "@/constant/tour/active-projects-buyer";
import { buildCreateBidTour } from "@/constant/tour/create-a-bid";
import { buildCreateProjectTour } from "@/constant/tour/create-a-project";
import { buildRecommendSizingChangesTour } from "@/constant/tour/recommend-sizing-changes";
import { buildReviewBidTour } from "@/constant/tour/review-bid";
import { buildSizingTemplateTour } from "@/constant/tour/sizing-template";
import { buildBuyerSizingTemplateTour } from "@/constant/tour/sizing-template-buyer";
import { WALLET_TOUR } from "@/constant/tour/wallet";
import { buildBuyerWelcomeTour } from "@/constant/tour/welcome-buyer";
import { DESIGNER_WELCOME_TOUR } from "@/constant/tour/welcome-designer";
import {
  clearActiveProjectsTourSession,
  clearCreateBidTourSession,
  clearCreateProjectTourSession,
  clearReviewBidTourSession,
  clearSizingTemplateTourSession,
  dispatchOpenInviteClient,
  getActiveProjectsTourProjectId,
  getCreateBidTourBidId,
  getCreateProjectTourProjectId,
  getReviewBidTourBidId,
  getSizingTemplateTourProjectId,
  getSizingTemplateTourTemplateId,
  setActiveProjectsTourProjectId,
  setCreateBidTourProjectId,
  setCreateProjectTourProjectId,
  setReviewBidTourBidId,
  setSizingTemplateTourTemplateId,
  setTourStatus,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
} from "@/tanstack/hooks/useProject";
import {
  useGetAllDesignerSizingTemplates,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";
import type { UmojaLinnSizingTemplate } from "@/types/project";

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

const NextStepTourProvider = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const profileRole = session?.user?.profileRole;
  const isDesigner = profileRole === "DESIGNER";
  const isBuyer = profileRole === "BUYER";

  const [showWelcomeComplete, setShowWelcomeComplete] = useState(false);
  const [createBidTourBidId, setCreateBidTourBidId] = useState<string | null>(
    null,
  );
  const [createProjectTourProjectId, setCreateProjectTourProjectIdState] =
    useState<string | null>(null);
  const [reviewBidTourBidId, setReviewBidTourBidIdState] = useState<
    string | null
  >(null);
  const [sizingTemplateTourContext, setSizingTemplateTourContext] = useState<{
    templateId: string;
    projectId: string;
  } | null>(null);

  const [activeProjectsTourProjectId, setActiveProjectsTourProjectIdState] =
    useState<string | null>(null);

  const { data: jobsData } = useGetAllDesignerProject(
    {
      projectStatus: "ADS",
      projectType: "PRIVATE",
      hasBid: false,
    },
    { enabled: isDesigner },
  );

  const { data: sizingTemplatesData } = useGetAllDesignerSizingTemplates({
    enabled: isDesigner,
  });

  const { data: buyerSizingTemplatesData } = useGetAllSizingTemplates(
    undefined,
    {
      enabled: isBuyer,
    },
  );

  const { data: liveProjectsData } = useGetAllDesignerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: isDesigner },
  );

  const { data: buyerLiveProjectsData } = useGetAllBuyerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: isBuyer },
  );

  const { data: buyerDraftProjectsData } = useGetAllBuyerProject(
    {
      projectStatus: "DRAFT",
    },
    { enabled: isBuyer },
  );

  const { data: buyerPendingBidsData } = useGetBuyerBids(
    { bidStatus: ["PENDING"] },
    { enabled: isBuyer },
  );

  const firstLiveProjectId = useMemo(() => {
    const firstProject = liveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [liveProjectsData?.data?.data]);

  const firstBuyerLiveProjectId = useMemo(() => {
    const firstProject = buyerLiveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [buyerLiveProjectsData?.data?.data]);

  const firstBuyerDraftProjectId = useMemo(() => {
    const firstProject = buyerDraftProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [buyerDraftProjectsData?.data?.data]);

  const firstPendingBidId = useMemo(() => {
    const firstBid = buyerPendingBidsData?.data?.data?.[0];

    if (!firstBid?.id) {
      return null;
    }

    return uuidToBase62Safe(firstBid.id);
  }, [buyerPendingBidsData?.data?.data]);

  const firstJobId = useMemo(() => {
    const firstJob = jobsData?.data?.data?.[0];

    if (!firstJob?.id) {
      return null;
    }

    return uuidToBase62Safe(firstJob.id);
  }, [jobsData?.data?.data]);

  const firstSizingTemplateContext = useMemo(() => {
    const firstTemplate = sizingTemplatesData?.data?.data?.[0];

    if (!firstTemplate?.id) {
      return null;
    }

    const activeProject =
      firstTemplate.projects?.find(
        (project) => project.status !== "COMPLETED",
      ) ?? firstTemplate.projects?.[0];

    if (!activeProject?.id) {
      return null;
    }

    return {
      templateId: uuidToBase62Safe(firstTemplate.id),
      projectId: uuidToBase62Safe(activeProject.id),
    };
  }, [sizingTemplatesData?.data?.data]);

  const firstBuyerSizingTemplateId = useMemo(() => {
    const template = pickBuyerSizingTemplate(
      buyerSizingTemplatesData?.data?.data,
    );

    if (!template?.id) {
      return null;
    }

    return uuidToBase62Safe(template.id);
  }, [buyerSizingTemplatesData?.data?.data]);

  useEffect(() => {
    setCreateBidTourBidId(getCreateBidTourBidId());

    const templateId = getSizingTemplateTourTemplateId();
    const projectId = getSizingTemplateTourProjectId();

    if (templateId) {
      setSizingTemplateTourContext({
        templateId,
        projectId: projectId ?? "",
      });
    }

    setActiveProjectsTourProjectIdState(getActiveProjectsTourProjectId());
    setCreateProjectTourProjectIdState(getCreateProjectTourProjectId());
    setReviewBidTourBidIdState(getReviewBidTourBidId());
  }, []);

  const steps = useMemo(() => {
    const welcomeTour = isDesigner
      ? DESIGNER_WELCOME_TOUR
      : buildBuyerWelcomeTour(firstBuyerLiveProjectId);

    const tours = [welcomeTour];

    if (isBuyer) {
      const createProjectId =
        createProjectTourProjectId ?? firstBuyerDraftProjectId;

      if (createProjectId) {
        tours.push(buildCreateProjectTour(createProjectId));
      }

      const reviewBidId = reviewBidTourBidId ?? firstPendingBidId;

      if (reviewBidId) {
        tours.push(buildReviewBidTour(reviewBidId));
      }

      const buyerSizingTemplateId =
        sizingTemplateTourContext?.templateId ?? firstBuyerSizingTemplateId;

      if (buyerSizingTemplateId) {
        tours.push(buildBuyerSizingTemplateTour(buyerSizingTemplateId));
      }

      const buyerActiveProjectId =
        activeProjectsTourProjectId ?? firstBuyerLiveProjectId;

      if (buyerActiveProjectId) {
        tours.push(buildBuyerActiveProjectsTour(buyerActiveProjectId));
      }

      return tours;
    }

    if (firstJobId) {
      tours.push(buildCreateBidTour(firstJobId, createBidTourBidId));
    }

    const sizingContext =
      sizingTemplateTourContext ?? firstSizingTemplateContext;

    if (sizingContext) {
      tours.push(
        buildSizingTemplateTour(
          sizingContext.templateId,
          sizingContext.projectId,
        ),
      );
    }

    tours.push(buildRecommendSizingChangesTour());

    tours.push(WALLET_TOUR);

    const activeProjectId = activeProjectsTourProjectId ?? firstLiveProjectId;

    if (activeProjectId) {
      tours.push(buildActiveProjectsTour(activeProjectId));
    }

    return tours;
  }, [
    isDesigner,
    isBuyer,
    firstBuyerLiveProjectId,
    firstBuyerDraftProjectId,
    createProjectTourProjectId,
    reviewBidTourBidId,
    firstPendingBidId,
    firstBuyerSizingTemplateId,
    firstJobId,
    createBidTourBidId,
    firstSizingTemplateContext,
    sizingTemplateTourContext,
    activeProjectsTourProjectId,
    firstLiveProjectId,
  ]);

  const syncCreateBidTourBidId = () => {
    setCreateBidTourBidId(getCreateBidTourBidId());
  };

  const handleTourComplete = (tourName: string | null) => {
    if (!tourName) {
      return;
    }

    setTourStatus(tourName as TTourName, "completed");

    if (tourName === "welcome") {
      setShowWelcomeComplete(true);
    }

    if (tourName === "create-a-bid") {
      clearCreateBidTourSession();
    }

    if (tourName === "create-a-project") {
      clearCreateProjectTourSession();
    }

    if (tourName === "review-bid") {
      clearReviewBidTourSession();
    }

    if (tourName === "sizing-template") {
      clearSizingTemplateTourSession();
    }

    if (tourName === "active-projects") {
      clearActiveProjectsTourSession();
    }
  };

  const handleTourSkip = (tourName: string | null) => {
    if (!tourName) {
      return;
    }

    setTourStatus(tourName as TTourName, "skipped");

    if (tourName === "create-a-bid") {
      clearCreateBidTourSession();
    }

    if (tourName === "create-a-project") {
      clearCreateProjectTourSession();
    }

    if (tourName === "review-bid") {
      clearReviewBidTourSession();
    }

    if (tourName === "sizing-template") {
      clearSizingTemplateTourSession();
    }

    if (tourName === "active-projects") {
      clearActiveProjectsTourSession();
    }
  };

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={TourCard}
        overlayZIndex={200}
        shadowRgb="0,0,0"
        shadowOpacity="0.65"
        onStart={(tourName) => {
          if (tourName === "create-a-bid" && firstJobId) {
            setCreateBidTourProjectId(firstJobId);
          }

          if (tourName === "active-projects") {
            const activeProjectId = isBuyer
              ? (activeProjectsTourProjectId ?? firstBuyerLiveProjectId)
              : (activeProjectsTourProjectId ?? firstLiveProjectId);

            if (activeProjectId) {
              setActiveProjectsTourProjectId(activeProjectId);
              setActiveProjectsTourProjectIdState(activeProjectId);
            }
          }

          if (tourName === "create-a-project") {
            const createProjectId =
              createProjectTourProjectId ?? firstBuyerDraftProjectId;

            if (createProjectId) {
              setCreateProjectTourProjectId(createProjectId);
              setCreateProjectTourProjectIdState(createProjectId);
            }
          }

          if (tourName === "review-bid") {
            const reviewBidId = reviewBidTourBidId ?? firstPendingBidId;

            if (reviewBidId) {
              setReviewBidTourBidId(reviewBidId);
              setReviewBidTourBidIdState(reviewBidId);
            }
          }

          if (tourName === "sizing-template" && isBuyer) {
            const templateId =
              sizingTemplateTourContext?.templateId ??
              firstBuyerSizingTemplateId;

            if (templateId) {
              setSizingTemplateTourTemplateId(templateId);
              setSizingTemplateTourContext({ templateId, projectId: "" });
            }
          }

          syncCreateBidTourBidId();
        }}
        onStepChange={() => {
          syncCreateBidTourBidId();
        }}
        onComplete={handleTourComplete}
        onSkip={(_, tourName) => handleTourSkip(tourName)}
      >
        {children}
        <TourLauncher />
        {isDesigner && (
          <>
            <CreateBidTourLauncher />
            <WalletTourLauncher />
            <ActiveProjectsTourLauncher />
          </>
        )}
        {isBuyer && (
          <>
            <CreateProjectTourLauncher />
            <ReviewBidTourLauncher />
            <BuyerActiveProjectsTourLauncher />
          </>
        )}
        {(isDesigner || isBuyer) && <SizingTemplateTourLauncher />}
        <WelcomeComplete
          open={showWelcomeComplete}
          onOpenChange={setShowWelcomeComplete}
          profileRole={profileRole}
          onInviteClient={dispatchOpenInviteClient}
          onCreateProject={() => router.push("/projects")}
        />
      </NextStep>
    </NextStepProvider>
  );
};

export default NextStepTourProvider;
