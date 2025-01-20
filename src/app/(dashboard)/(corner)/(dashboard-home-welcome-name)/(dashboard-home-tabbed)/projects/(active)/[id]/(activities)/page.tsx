"use client";
import MilestoneTimeline from "@/components/custom/milestone/Timeline";
import EscrowCard from "@/section/dashboard/project/active/EscrowCard";
import { useGetProjectMilestones } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

// const activities: MilestoneTimelineItem[] = [
//   {
//     id: "1",
//     title: "Project Kickoff",
//     date: "2024-01-01",
//     status: MilestoneStatus.AWAITING_FUND,
//     isCurrent: true,
//     amount: 26000,
//     description:
//       "The project begins with the initial planning and team formation.",
//   },
//   {
//     id: "2",
//     title: "Phase 1 Completion",
//     date: "2024-03-15",
//     status: MilestoneStatus.INACTIVE,
//     amount: 26000,
//     description:
//       "Phase 1 of the project is complete, with major deliverables met.",
//     info: "Project is now moving to Phase 2.",
//   },
//   {
//     id: "3",
//     title: "Phase 2 Start",
//     date: "2024-04-01",
//     status: MilestoneStatus.INACTIVE,
//     amount: 26000,
//     description:
//       "The project moves into Phase 2, focusing on implementation and development.",
//   },
//   {
//     id: "4",
//     title: "Testing and QA",
//     date: "2024-07-10",
//     status: MilestoneStatus.INACTIVE,
//     amount: 26000,
//     description:
//       "Testing and quality assurance phase begins, ensuring product stability.",
//   },
//   {
//     id: "5",
//     title: "Project Completion",
//     date: "2024-12-01",
//     status: MilestoneStatus.INACTIVE,
//     amount: 26000,
//     description: "The project is completed, all objectives have been met.",
//   },
// ];

const ActiveProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projectMilestonesData, isPending: isLoadingProjectMilestones } =
    useGetProjectMilestones(id);

  if (isLoadingProjectMilestones)
    return (
      <div className="h-[30vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-12">
      <MilestoneTimeline
        currency="EURO"
        isBuyer
        milestones={projectMilestonesData?.data?.data || []}
        className="flex-1"
      />
      <aside className="md:max-w-80 flex-1 w-full shrink-0">
        <EscrowCard />
      </aside>
    </div>
  );
};

export default ActiveProjectPage;
