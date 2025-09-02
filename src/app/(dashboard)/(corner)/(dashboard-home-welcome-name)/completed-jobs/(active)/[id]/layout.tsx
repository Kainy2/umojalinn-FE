"use client";
import EscrowCard from '@/section/dashboard/project/active/EscrowCard';
import ActiveProjectSummary from "@/section/dashboard/project/active/Summary";
import ActiveProjectTab from "@/section/dashboard/project/active/Tab";
import { useGetProjectById, useGetProjectMilestones } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
    const { id } = useParams<{ id: string }>();
  
    const { data: projectMilestonesData } = useGetProjectMilestones(id);
    const { data: projectData, isPending: isLoadingProject } =
      useGetProjectById(id);
  

  return (
    <>
      <ActiveProjectSummary isDesigner />

			<div className='md:hidden'>
				{!isLoadingProject && (
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
				)}
			</div>

      <ActiveProjectTab baseUrlSlug="completed-jobs" />
      {children}
    </>
  );
};

export default Layout;
