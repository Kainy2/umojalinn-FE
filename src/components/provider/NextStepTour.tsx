"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { buildDesignerWelcomeTour } from "@/constant/tour/welcome-designer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  clearActiveProjectsTourSession,
  clearCreateBidTourSession,
  clearCreateProjectTourSession,
  clearReviewBidTourSession,
  clearSizingTemplateTourSession,
  dispatchOpenInviteClient,
  dispatchTourMobileMenuOpen,
  ensureMobileMenuForTourSelector,
  getActiveProjectsTourProjectId,
  getCreateBidTourBidId,
  getCreateProjectTourProjectId,
  getReviewBidTourBidId,
  getSizingTemplateTourProjectId,
  getSizingTemplateTourTemplateId,
  getTourStepAt,
  pickBuyerSizingTemplate,
  registerTourSteps,
  setActiveProjectsTourProjectId,
  setCreateBidTourProjectId,
  setCreateProjectTourProjectId,
  setReviewBidTourBidId,
  setSizingTemplateTourTemplateId,
  setTourStatus,
  tourNameToGuidedTourStep,
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
import { useCompleteGuidedTour } from "@/tanstack/hooks/useUser";

const NextStepTourProvider = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const profileRole = session?.user?.profileRole;
  const isDesigner = profileRole === "DESIGNER";
  const isBuyer = profileRole === "BUYER";
  const isDesktop = useMediaQuery("md");
  const { mutate: completeGuidedTour } = useCompleteGuidedTour();

  const persistGuidedTourStep = useCallback(
    (tourName: TTourName) => {
      if (profileRole !== "BUYER" && profileRole !== "DESIGNER") {
        return;
      }

      const step = tourNameToGuidedTourStep(tourName, profileRole);
      if (!step) {
        return;
      }

      completeGuidedTour({ profileType: profileRole, step });
    },
    [completeGuidedTour, profileRole],
  );

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

  const hasBuyerSizingTemplates =
    !!buyerSizingTemplatesData?.data?.data?.length;

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
      ? buildDesignerWelcomeTour(isDesktop)
      : buildBuyerWelcomeTour(isDesktop);

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

      if (hasBuyerSizingTemplates) {
        tours.push(buildBuyerSizingTemplateTour(firstBuyerSizingTemplateId));
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
      const templates = sizingTemplatesData?.data?.data;
      const template =
        templates?.find(
          (item) => uuidToBase62Safe(item.id) === sizingContext.templateId,
        ) ?? templates?.[0];
      const linkedProject =
        template?.projects?.find(
          (project) => uuidToBase62Safe(project.id) === sizingContext.projectId,
        ) ??
        template?.projects?.find((project) => project.status !== "COMPLETED") ??
        template?.projects?.[0];
      // Match SELECT mode: only show the request step when points were never
      // requested (including during the bid phase via the linked project).
      const canRequestMeasurementPoints =
        template?.status === "IN_USE" &&
        !(template.requestedMeasurementPoints?.length) &&
        !(linkedProject?.requestedMeasurementPoints?.length);

      tours.push(
        buildSizingTemplateTour(
          sizingContext.templateId,
          sizingContext.projectId,
          canRequestMeasurementPoints,
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
    isDesktop,
    firstBuyerLiveProjectId,
    firstBuyerDraftProjectId,
    createProjectTourProjectId,
    reviewBidTourBidId,
    firstPendingBidId,
    firstBuyerSizingTemplateId,
    hasBuyerSizingTemplates,
    firstJobId,
    createBidTourBidId,
    firstSizingTemplateContext,
    sizingTemplateTourContext,
    sizingTemplatesData?.data?.data,
    activeProjectsTourProjectId,
    firstLiveProjectId,
  ]);

  registerTourSteps(steps);

  // nextstepjs puts `onStart` in a useEffect dep array — keep it stable and
  // avoid setState that always produces a new object (infinite re-render loop).
  const syncCreateBidTourBidId = useCallback(() => {
    setCreateBidTourBidId(getCreateBidTourBidId());
  }, []);

  const handleTourStart = useCallback(
    (tourName: string | null) => {
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
        const templateId = firstBuyerSizingTemplateId;

        if (templateId) {
          setSizingTemplateTourTemplateId(templateId);
          setSizingTemplateTourContext((prev) =>
            prev?.templateId === templateId && prev.projectId === ""
              ? prev
              : { templateId, projectId: "" },
          );
        }
      }

      syncCreateBidTourBidId();
      void ensureMobileMenuForTourSelector(
        getTourStepAt(tourName, 0)?.selector,
      );
    },
    [
      activeProjectsTourProjectId,
      createProjectTourProjectId,
      firstBuyerDraftProjectId,
      firstBuyerLiveProjectId,
      firstBuyerSizingTemplateId,
      firstJobId,
      firstLiveProjectId,
      firstPendingBidId,
      isBuyer,
      reviewBidTourBidId,
      syncCreateBidTourBidId,
    ],
  );

  const handleStepChange = useCallback(
    (stepIndex: number, tourName: string | null) => {
      syncCreateBidTourBidId();
      void ensureMobileMenuForTourSelector(
        getTourStepAt(tourName, stepIndex)?.selector,
      );
    },
    [syncCreateBidTourBidId],
  );

  const handleTourComplete = useCallback(
    (tourName: string | null) => {
      if (!tourName) {
        return;
      }

      dispatchTourMobileMenuOpen(false);
      setTourStatus(tourName as TTourName, "completed");
      persistGuidedTourStep(tourName as TTourName);

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
    },
    [persistGuidedTourStep],
  );

  const handleTourSkip = useCallback(
    (tourName: string | null) => {
      if (!tourName) {
        return;
      }

      dispatchTourMobileMenuOpen(false);
      setTourStatus(tourName as TTourName, "skipped");
      persistGuidedTourStep(tourName as TTourName);

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
    },
    [persistGuidedTourStep],
  );

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={TourCard}
        cardTransition={{ ease: "easeOut", duration: 0.25 }}
        overlayZIndex={200}
        shadowRgb="0,0,0"
        shadowOpacity="0.65"
        onStart={handleTourStart}
        onStepChange={handleStepChange}
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
