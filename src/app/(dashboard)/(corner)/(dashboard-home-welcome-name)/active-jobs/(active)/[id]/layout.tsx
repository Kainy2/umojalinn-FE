"use client";
import ActiveProjectSummary from '@/section/dashboard/project/active/Summary';
import ActiveProjectTab from '@/section/dashboard/project/active/Tab';
import { useGetAllDesignerProject } from '@/tanstack/hooks/useProject';
import React from 'react';

const Layout = ({ children }: LayoutProps) => {
	const { data: designerProjects } = useGetAllDesignerProject({
		projectStatus: 'LIVE',
	});
	return designerProjects?.data.data.length ? (
		<>
			<ActiveProjectSummary isDesigner />
			<ActiveProjectTab baseUrlSlug="active-jobs" />
			{children}
		</>
	) : null;
};

export default Layout;
