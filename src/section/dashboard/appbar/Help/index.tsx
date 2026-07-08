"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useNextStep } from "nextstepjs";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BUYER_HELP_CENTRE_OPTIONS,
  DESIGNER_HELP_CENTRE_OPTIONS,
  HELP_CHAT_URL,
  HELP_DEMO_URL,
  HELP_SUPPORT_EMAIL,
  HELP_WEBINAR_URL,
  type THelpCentreActionId,
} from "@/constant/help";
import {
  BUYER_HELP_TOUR_OPTIONS,
  DESIGNER_HELP_TOUR_OPTIONS,
} from "@/constant/tour/help";
import {
  setActiveProjectsTourProjectId,
  setCreateBidTourProjectId,
  setCreateProjectTourProjectId,
  setReviewBidTourBidId,
  setSizingTemplateTourProjectId,
  setSizingTemplateTourTemplateId,
} from "@/lib/tour";
import { uuidToBase62Safe } from "@/lib/uuid";
import HelpCentre from "@/section/dashboard/appbar/Help/HelpCentre";
import GuidedTours from "@/section/dashboard/appbar/Help/GuidedTours";
import type {
  IHelpTourOption,
  THelpView,
} from "@/section/dashboard/appbar/Help/@types";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
} from "@/tanstack/hooks/useProject";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";
import { useGetAllDesignerSizingTemplates, useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import type { TTourName } from "@/constant/tour/@types";
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

const Help = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<THelpView>("help-centre");
  const router = useRouter();
  const { data: session } = useSession();
  const { startNextStep, isNextStepVisible } = useNextStep();

  const isDesigner = session?.user?.profileRole === "DESIGNER";
  const helpCentreOptions = isDesigner
    ? DESIGNER_HELP_CENTRE_OPTIONS
    : BUYER_HELP_CENTRE_OPTIONS;

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

  const { data: liveProjectsData } = useGetAllDesignerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: isDesigner },
  );

  const { data: buyerDraftProjectsData } = useGetAllBuyerProject(
    {
      projectStatus: "DRAFT",
    },
    { enabled: !isDesigner },
  );

  const { data: buyerPendingBidsData } = useGetBuyerBids(
    { bidStatus: ["PENDING"] },
    { enabled: !isDesigner },
  );

  const { data: buyerSizingTemplatesData } = useGetAllSizingTemplates(undefined, {
    enabled: !isDesigner,
  });

  const { data: buyerLiveProjectsData } = useGetAllBuyerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: !isDesigner },
  );

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
      firstTemplate.projects?.find((project) => project.status !== "COMPLETED") ??
      firstTemplate.projects?.[0];

    if (!activeProject?.id) {
      return null;
    }

    return {
      templateId: uuidToBase62Safe(firstTemplate.id),
      projectId: uuidToBase62Safe(activeProject.id),
    };
  }, [sizingTemplatesData?.data?.data]);

  const firstLiveProjectId = useMemo(() => {
    const firstProject = liveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [liveProjectsData?.data?.data]);

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

  const firstBuyerSizingTemplateId = useMemo(() => {
    const template = pickBuyerSizingTemplate(buyerSizingTemplatesData?.data?.data);

    if (!template?.id) {
      return null;
    }

    return uuidToBase62Safe(template.id);
  }, [buyerSizingTemplatesData?.data?.data]);

  const firstBuyerLiveProjectId = useMemo(() => {
    const firstProject = buyerLiveProjectsData?.data?.data?.[0];

    if (!firstProject?.id) {
      return null;
    }

    return uuidToBase62Safe(firstProject.id);
  }, [buyerLiveProjectsData?.data?.data]);

  const tourOptions = useMemo<IHelpTourOption[]>(() => {
    const baseOptions = isDesigner
      ? DESIGNER_HELP_TOUR_OPTIONS
      : BUYER_HELP_TOUR_OPTIONS;

    if (!isDesigner) {
      return baseOptions.map((option) => {
        if (option.tourId === "create-a-project") {
          return { ...option, disabled: !firstBuyerDraftProjectId };
        }

        if (option.tourId === "review-bid") {
          return { ...option, disabled: !firstPendingBidId };
        }

        if (option.tourId === "sizing-template") {
          return { ...option, disabled: !firstBuyerSizingTemplateId };
        }

        if (option.tourId === "active-projects") {
          return { ...option, disabled: !firstBuyerLiveProjectId };
        }

        return option;
      });
    }

    return baseOptions.map((option) => {
      if (option.tourId === "create-a-bid") {
        return { ...option, disabled: !firstJobId };
      }

      if (option.tourId === "sizing-template") {
        return { ...option, disabled: !firstSizingTemplateContext };
      }

      if (option.tourId === "active-projects") {
        return { ...option, disabled: !firstLiveProjectId };
      }

      if (option.tourId === "recommend-sizing-changes") {
        return { ...option, disabled: !firstSizingTemplateContext };
      }

      return option;
    });
  }, [
    firstBuyerDraftProjectId,
    firstBuyerLiveProjectId,
    firstBuyerSizingTemplateId,
    firstJobId,
    firstLiveProjectId,
    firstPendingBidId,
    firstSizingTemplateContext,
    isDesigner,
  ]);

  const prepareTourStart = (tourId: TTourName) => {
    if (tourId === "create-a-bid" && firstJobId) {
      setCreateBidTourProjectId(firstJobId);
    }

    if (tourId === "create-a-project" && firstBuyerDraftProjectId) {
      setCreateProjectTourProjectId(firstBuyerDraftProjectId);
    }

    if (tourId === "review-bid" && firstPendingBidId) {
      setReviewBidTourBidId(firstPendingBidId);
    }

    if (tourId === "sizing-template") {
      if (isDesigner && firstSizingTemplateContext) {
        setSizingTemplateTourTemplateId(firstSizingTemplateContext.templateId);
        setSizingTemplateTourProjectId(firstSizingTemplateContext.projectId);
      }

      if (!isDesigner && firstBuyerSizingTemplateId) {
        setSizingTemplateTourTemplateId(firstBuyerSizingTemplateId);
      }
    }

    if (tourId === "active-projects") {
      const projectId = isDesigner ? firstLiveProjectId : firstBuyerLiveProjectId;

      if (projectId) {
        setActiveProjectsTourProjectId(projectId);
      }
    }
  };

  const handleStartTour = (tourId: TTourName) => {
    prepareTourStart(tourId);

    // The recommend-changes tour runs on a specific template detail page, so
    // navigate there first and start once the page has had time to render.
    if (tourId === "recommend-sizing-changes" && firstSizingTemplateContext) {
      router.push(
        `/sizing-templates/${firstSizingTemplateContext.templateId}?projectId=${firstSizingTemplateContext.projectId}`,
      );
      setOpen(false);
      setView("help-centre");
      window.setTimeout(() => startNextStep(tourId), 800);
      return;
    }

    startNextStep(tourId);
    setOpen(false);
    setView("help-centre");
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    setView("help-centre");
  };

  const openSupportEmail = () => {
    window.location.href = `mailto:${HELP_SUPPORT_EMAIL}`;
    setOpen(false);
    setView("help-centre");
  };

  const handleHelpCentreAction = (actionId: THelpCentreActionId) => {
    if (actionId === "guided-tours") {
      setView("guided-tours");
      return;
    }

    if (actionId === "chat") {
      if (HELP_CHAT_URL) {
        openExternalLink(HELP_CHAT_URL);
        return;
      }

      openSupportEmail();
      return;
    }

    if (actionId === "webinars") {
      if (HELP_WEBINAR_URL) {
        openExternalLink(HELP_WEBINAR_URL);
        return;
      }

      openSupportEmail();
      return;
    }

    if (actionId === "demo") {
      if (HELP_DEMO_URL) {
        openExternalLink(HELP_DEMO_URL);
        return;
      }

      openSupportEmail();
      return;
    }

    if (actionId === "email" || actionId === "contact") {
      openSupportEmail();
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setView("help-centre");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id="tour-appbar-help"
          variant="ghost"
          className="font-normal"
          aria-label="Help"
        >
          <CircleHelp className="icon-base" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        {view === "help-centre" ? (
          <HelpCentre
            options={helpCentreOptions}
            onSelectAction={handleHelpCentreAction}
          />
        ) : (
          <GuidedTours
            options={tourOptions}
            isTourActive={isNextStepVisible}
            onBack={() => setView("help-centre")}
            onStartTour={handleStartTour}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Help;
