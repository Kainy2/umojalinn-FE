"use client";
import { useMediaQuery } from '@/hooks/use-media-query';
import EscrowCardReviews from '@/section/dashboard/project/active/EscrowCardReviews';
import ActiveProjectSummary from "@/section/dashboard/project/active/Summary";
import ActiveProjectTab from "@/section/dashboard/project/active/Tab";
import { useGetProjectById, useGetProjectMilestones } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
    const { id } = useParams<{ id: string }>();
    const isDesktop = useMediaQuery('md');
  
    const { data: projectMilestonesData } = useGetProjectMilestones(id);
    const { data: projectData, isPending: isLoadingProject } =
      useGetProjectById(id);
  

  return (
    <>
      <ActiveProjectSummary isDesigner />

      {!isLoadingProject && !isDesktop && (
				<div className="md:hidden -mt-8">
					<EscrowCardReviews
						reviews={projectData?.data?.data?.reviews || []}
						projectId={projectData?.data?.data?.id}
						milestones={projectMilestonesData?.data?.data || []}
						project={projectData?.data?.data}
					/>
				</div>
			)}

      <ActiveProjectTab baseUrlSlug="completed-jobs" />
      {children}
    </>
  );
};

export default Layout;
