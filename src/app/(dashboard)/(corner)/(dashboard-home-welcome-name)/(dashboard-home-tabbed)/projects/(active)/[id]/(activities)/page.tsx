"use client";
import Invoice from "@/components/custom/Invoice";
import MilestoneTimeline from "@/components/custom/milestone/Timeline";
import EscrowCard from "@/section/dashboard/project/active/EscrowCard";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { redirect, useParams } from "next/navigation";
import React from "react";

import { PDFViewer } from "@react-pdf/renderer";

const ActiveProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projectMilestonesData, isPending: isLoadingProjectMilestones } =
    useGetProjectMilestones(id);

  const { data: projectData, isPending: isLoadingProject } =
    useGetProjectById(id);

  const { data: meData, isPending: isLoadingMe } = useGetMe();

  if (isLoadingProjectMilestones || isLoadingProject || isLoadingMe)
    return (
      <div className="h-[30vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Loading...</span>
      </div>
    );

  if (projectData?.data?.data?.status) {
    if (projectData?.data?.data?.status === "COMPLETED") {
      return redirect("/projects/completed");
    }
    if (projectData?.data?.data?.status !== "LIVE") return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-12">
      <MilestoneTimeline
        projectId={projectData?.data?.data?.id}
        currency={projectData?.data?.data?.currency || null}
        isBuyer={
          projectData?.data?.data?.buyerId ===
          meData?.data?.data?.buyerProfile?.id
        }
        milestones={projectMilestonesData?.data?.data || []}
        className="flex-1"
      />
      <aside className="md:max-w-80 flex-1 w-full shrink-0">
        <EscrowCard
          projectId={projectData?.data?.data?.id}
          milestones={projectMilestonesData?.data?.data || []}
          paidOut={projectData?.data?.data?.amountFunded || 0}
          currency={projectData?.data?.data?.currency}
          escrowBalance={projectData?.data?.data?.escrowBalance || 0}
          projectPrice={projectData?.data?.data?.approvedBudget || 0}
          reviews={projectData?.data?.data?.reviews || []}
          project={projectData?.data?.data}
        />
      </aside>
    </div>
  );
};

export default ActiveProjectPage;
