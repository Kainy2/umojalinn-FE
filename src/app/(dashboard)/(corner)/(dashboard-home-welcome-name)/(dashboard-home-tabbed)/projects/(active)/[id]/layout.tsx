"use client";
import ActiveProjectSummary from "@/section/dashboard/project/active/Summary";
import ActiveProjectTab from "@/section/dashboard/project/active/Tab";
import EscrowCardReviews from '@/section/dashboard/project/active/EscrowCardReviews';
import { useGetProjectById, useGetProjectMilestones } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";

const Layout = ({ children }: LayoutProps) => {
    const { id } = useParams<{ id: string }>();

  const { data: projectMilestonesData } = useGetProjectMilestones(id);
  const { data: projectData, isPending: isLoadingProject } =
    useGetProjectById(id);

  return (
    <>
      <ActiveProjectSummary />

      <div className='md:hidden -mt-8'>
				{!isLoadingProject && (
					<EscrowCardReviews
            reviews={projectData?.data?.data?.reviews || []}
						projectId={projectData?.data?.data?.id}
						milestones={projectMilestonesData?.data?.data || []}
						project={projectData?.data?.data}
					/>
				)}
			</div>
      
      <ActiveProjectTab />
      {children}
    </>
  );
};

export default Layout;
