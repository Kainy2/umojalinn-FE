"use client";
import MilestoneTimeline from "@/components/custom/milestone/Timeline";
import { MeasurementPointsReminderBanner } from "@/components/sizing-template";
import EscrowCard from "@/section/dashboard/project/active/EscrowCard";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { useGetSizingTemplateById } from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { uuidToBase62Safe } from "@/lib/uuid";
import { shouldDisableDesignerMilestoneSubmission } from "@/lib/sizing-template-utils";
import { redirect, useParams } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

// MP - Measurement Points

const ActiveProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projectMilestonesData, isPending: isLoadingProjectMilestones } =
    useGetProjectMilestones(id);

  const { data: projectData, isPending: isLoadingProject } =
    useGetProjectById(id);

  const { data: meData, isPending: isLoadingMe } = useGetMe();
  const { data: session } = useSession();

  const project = projectData?.data?.data;
  const sizingTemplateId = project?.sizingTemplateId;

  // Fetch sizing template to check if measurement points have been requested
  const { data: templateData, isPending: isLoadingSizingTemplate } =
    useGetSizingTemplateById(
      sizingTemplateId ? uuidToBase62Safe(sizingTemplateId) : undefined,
      { enabled: !!sizingTemplateId },
    );

  const sizingTemplate = templateData?.data?.data;
  const isDesigner = session?.user?.profileRole === "DESIGNER";

  // Check if measurement points have NOT been requested (null or empty)
  const hasMeasurementPointsRequested =
    sizingTemplate?.requestedMeasurementPoints &&
    sizingTemplate.requestedMeasurementPoints.length > 0;
  // Check if measurement points have NOT been requested (null or empty)
  const hasMeasurementPointsSubmitted =
    sizingTemplate?.submittedMeasurementPoints &&
    sizingTemplate.submittedMeasurementPoints.length > 0;

  if (
    isLoadingProjectMilestones ||
    isLoadingProject ||
    isLoadingMe ||
    isLoadingSizingTemplate
  )
    return (
      <div className="h-[30vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Loading...</span>
      </div>
    );
  if (project?.status) {
    if (project.status === "COMPLETED") {
      return redirect("/projects/completed");
    }
    if (project.status !== "LIVE") return null;
  }

  // for buyer, Show reminder to buyer to tell designer to send measurement point fields
  // for designer, Should go to send measurement points fields in sizing template page, if designer has not submitted measurement points values
  const showRequestPointsBanner =
    !!sizingTemplateId &&
    !!sizingTemplate &&
    !hasMeasurementPointsRequested &&
    !hasMeasurementPointsSubmitted;
  const disableDesignerMilestoneSubmission =
    isDesigner &&
    shouldDisableDesignerMilestoneSubmission(sizingTemplateId, sizingTemplate);

  // Show reminder to designer to tell buyer to send measurement points values
  const isAwaitingMeasurementPointsValues =
    isDesigner &&
    !!sizingTemplateId &&
    !!sizingTemplate &&
    hasMeasurementPointsRequested &&
    !hasMeasurementPointsSubmitted;

  return (
    <div className="flex flex-col">
      {/* Reminder Banner - shown when measurement points haven't been requested */}
      {(showRequestPointsBanner || isAwaitingMeasurementPointsValues) && (
        <MeasurementPointsReminderBanner
          templateId={sizingTemplateId}
          projectId={project?.id || ""}
          lastReminderSentAt={sizingTemplate?.lastReminderSentAt}
          lastReminderSentBy={sizingTemplate?.lastReminderSentBy}
          isBuyer={!isDesigner}
          isProjectLive={project?.status === "LIVE"}
          isAwaitingMeasurementPointsValues={isAwaitingMeasurementPointsValues}
          className="mb-2"
        />
      )}
      <div className="flex flex-col mt-8 md:mt-0  md:flex-row gap-12 pt-4 lg:pt-8">
        <MilestoneTimeline
          buyer={project?.buyer.user}
          designer={project?.designer.user}
          projectId={project?.id}
          projectName={project?.title ?? undefined}
          currency={project?.currency || null}
          escrowBalance={project?.escrowBalance || 0}
          isDesigner={
            project?.buyerId === meData?.data?.data?.designerProfile?.id
          }
          milestones={projectMilestonesData?.data?.data || []}
          className="flex-1"
          disableDesignerSubmission={disableDesignerMilestoneSubmission}
        />
        <aside className="md:max-w-80 flex-1 w-full shrink-0">
          <EscrowCard
            projectId={project?.id}
            milestones={projectMilestonesData?.data?.data || []}
            currency={project?.currency}
            escrowBalance={project?.escrowBalance || 0}
            projectPrice={project?.approvedBudget || 0}
            reviews={project?.reviews || []}
            project={project}
          />
        </aside>
      </div>
    </div>
  );
};

export default ActiveProjectPage;
