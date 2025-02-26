"use client";
import EscrowCard from "@/section/dashboard/project/active/EscrowCard";
import ChatWindow from "@/section/dashboard/project/ChatWindow";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const ActiveProjectChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projectMilestonesData } = useGetProjectMilestones(id);

  const { data: projectData } = useGetProjectById(id);

  return (
    <div className="flex flex-col md:flex-row gap-12">
      <ChatWindow projectId={id} />
      <aside className="md:max-w-80 flex-1 w-full shrink-0">
        <EscrowCard
          projectId={projectData?.data?.data?.id}
          milestones={projectMilestonesData?.data?.data || []}
          paidOut={projectData?.data?.data?.amountFunded || 0}
          currency={projectData?.data?.data?.currency}
          escrowBalance={projectData?.data?.data?.escrowBalance || 0}
          projectPrice={projectData?.data?.data?.approvedBudget || 0}
        />
      </aside>
    </div>
  );
};

export default ActiveProjectChatPage;
