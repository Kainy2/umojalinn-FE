"use client";
import Alert from "@/components/custom/Alert";

import { Button } from "@/components/ui/button";

import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { useFundMilestone, useFundProject } from "@/tanstack/hooks/useProject";

const FundProjectAlert = () => {
  const pathname = usePathname();
  const { data: me } = useSession();
  const params = useParams<{ id: string }>();
  const { data: projectData } = useGetProjectById(params?.id);

  const { data: projectMilestonesData } = useGetProjectMilestones(params?.id);

  const firstFundMilestone = useMemo(
    () =>
      projectMilestonesData?.data?.data?.find?.(
        (milestone) => milestone?.status === "PENDING",
      ),
    [projectMilestonesData?.data?.data],
  );

  const isDesigner = me?.user?.profileRole === "DESIGNER";
  const excludedPaths = ["ads", "completed", "bids", "drafts"];
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));
  const isAwaitingFund =
    projectData?.data?.data?.fundStatus === "AWAITING_FUND";
  const isUnfunded = Number(projectData?.data?.data?.amountFunded) === 0;
  const fundMilestone = useFundMilestone({
    onSuccess: (data) => {
      window.open(data.data.data.checkoutUrl, "_blank", "noopener,noreferrer");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const fundProject = useFundProject(params.id, {
    onSuccess: (data) => {
      window.open(data.data.data.checkoutUrl, "_blank", "noopener,noreferrer");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  console.log(isAwaitingFund, isUnfunded);

  if (isExcludedPath || !isAwaitingFund || !isUnfunded || isDesigner)
    return null;

  return (
    <Alert
      className="w-[90vw] lg:w-[70vw] mt- mb-8 rounded-lg shadow-md shadow-error-700/25"
      type="error"
      icon={<AlertTriangle />}
      title="Awaiting fund"
      message="fund escrow to start project"
      action={
        <div className="flex flex-col md:flex-row gap-1">
          <Button
            className="w-full md:w-auto"
            variant="outline"
            disabled={!firstFundMilestone}
            onClick={() => fundMilestone.mutate(firstFundMilestone?.id || "")}
          >
            Fund Milestone
          </Button>
          <Button
            className="w-full md:w-auto"
            onClick={() => fundProject.mutate()}
          >
            Fund Project
          </Button>
        </div>
      }
    />
  );
};

export default FundProjectAlert;
