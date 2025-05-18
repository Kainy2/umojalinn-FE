"use client";
import Alert from "@/components/custom/Alert";
import SelectFundingMethodDialog from "@/components/custom/dialog/SelectFundingMethod";
import { Button } from "@/components/ui/button";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { AlertTriangle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const FundProjectAlert = () => {
  const pathname=usePathname();
  const params = useParams<{ id: string }>();
  const { data: projectData } = useGetProjectById(params?.id);

  const { data: projectMilestonesData } = useGetProjectMilestones(params?.id);

  const firstFundMilestone = useMemo(
    () =>
      projectMilestonesData?.data?.data?.find?.(
        (milestone) => milestone?.status === "PENDING"
      ),
    [projectMilestonesData?.data?.data]
  );

 const excludedPaths = ['ads', 'completed', 'bids', 'drafts'];
  const isExcludedPath = excludedPaths.some(path => pathname.includes(path));
  const isAwaitingFund = projectData?.data?.data?.fundStatus === "AWAITING_FUND";
  const isUnfunded = projectData?.data?.data?.amountFunded === 0;

  if (isExcludedPath || !isAwaitingFund || !isUnfunded) return null;

  return (
    <Alert
      className="w-[90vw] lg:w-[70vw] mt- mb-8 rounded-lg shadow-md shadow-error-700/25"
      type="error"
      icon={<AlertTriangle />}
      title="Awaiting fund"
      message="fund escrow to start project"
      action={
        <div className="flex flex-col md:flex-row gap-1">
          <SelectFundingMethodDialog
            id={uuidToBase62Safe(firstFundMilestone?.id || "")}
            type="milestone"
          >
            <Button
              className="w-full md:w-auto"
              variant="outline"
              disabled={!firstFundMilestone}
            >
              Fund Milestone
            </Button>
          </SelectFundingMethodDialog>
          <SelectFundingMethodDialog id={params?.id} type="project">
            <Button className="w-full md:w-auto">Fund Project</Button>
          </SelectFundingMethodDialog>
        </div>
      }
    />
  );
};

export default FundProjectAlert;
