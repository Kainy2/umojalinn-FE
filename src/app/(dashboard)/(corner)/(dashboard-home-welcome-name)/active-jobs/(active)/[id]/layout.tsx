"use client";
import EscrowCardReviews from '@/section/dashboard/project/active/EscrowCardReviews';
import ActiveProjectSummary from '@/section/dashboard/project/active/Summary';
import ActiveProjectTab from '@/section/dashboard/project/active/Tab';
import { useGetAllDesignerProject, useGetProjectById, useGetProjectMilestones } from '@/tanstack/hooks/useProject';
import { useParams } from 'next/navigation';
import React from 'react';

const Layout = ({ children }: LayoutProps) => {
	const { data: designerProjects } = useGetAllDesignerProject({
		projectStatus: 'LIVE',
	});
	const { id } = useParams<{ id: string }>();

	const { data: projectMilestonesData } = useGetProjectMilestones(id);
	const { data: projectData, isPending: isLoadingProject } =
		useGetProjectById(id);

	return designerProjects?.data.data.length ? (
		<>
			<ActiveProjectSummary isDesigner />

			<div className='md:hidden'>
				{!isLoadingProject && (
					<EscrowCardReviews
						projectId={projectData?.data?.data?.id}
						milestones={projectMilestonesData?.data?.data || []}
						project={projectData?.data?.data}
					/>
				)}
			</div>

			<ActiveProjectTab baseUrlSlug="active-jobs" />
			{children}
		</>
	) : null;
};

export default Layout;
