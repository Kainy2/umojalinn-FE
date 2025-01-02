"use client";
import MilestoneTimeline, {
  MilestoneTimelineItem,
} from "@/components/custom/MilestoneTimeline";
import EscrowCard from "@/section/dashboard/project/active/EscrowCard";
import React from "react";

const activities: MilestoneTimelineItem[] = [
  {
    id: "1",
    title: "Project Kickoff",
    date: "2024-01-01",
    description:
      "The project begins with the initial planning and team formation.",
    isActive: true,
    pill: {
      value: "Kickoff",
      label: "Start",
      color: "SUCCESS",
    },
    link: {
      label: "Learn More",
      href: "/kickoff",
    },
  },
  {
    id: "2",
    title: "Phase 1 Completion",
    date: "2024-03-15",
    description:
      "Phase 1 of the project is complete, with major deliverables met.",
    isActive: true,
    pill: {
      value: "Completed",
      label: "Phase 1 Complete",
      color: "SUCCESS",
    },
    afterPill: <span>Project is now moving to Phase 2.</span>,
    link: {
      label: "Phase 1 Report",
      href: "/phase-1-report",
    },
  },
  {
    id: "3",
    title: "Phase 2 Start",
    date: "2024-04-01",
    description:
      "The project moves into Phase 2, focusing on implementation and development.",
    isCurrent: true,
    pill: {
      value: "Ongoing",
      label: "Phase 2",
      color: "SUCCESS",
    },
    actions: [
      {
        children: "Cancel",
        variant: "outline",
        onClick: () => console.log("Cancelling"),
      },
      {
        children: "View Details",
        onClick: () => console.log("Viewing details for Phase 2"),
      },
    ],
  },
  {
    id: "4",
    title: "Testing and QA",
    date: "2024-07-10",
    description:
      "Testing and quality assurance phase begins, ensuring product stability.",
    isActive: false,
    pill: {
      value: "Upcoming",
      label: "QA & Testing",
      color: "ERROR",
    },
    link: {
      label: "Testing Plan",
      href: "/testing-plan",
    },
  },
  {
    id: "5",
    title: "Project Completion",
    date: "2024-12-01",
    description: "The project is completed, all objectives have been met.",
    isActive: false,
    isCurrent: false,
    pill: {
      value: "Completed",
      label: "Completed",
      color: "SUCCESS",
    },
  },
];

const ActiveProjectPage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-12">
      <MilestoneTimeline items={activities} className="flex-1" />
      <aside className="md:max-w-80 flex-1 w-full shrink-0">
        <EscrowCard />
      </aside>
    </div>
  );
};

export default ActiveProjectPage;
