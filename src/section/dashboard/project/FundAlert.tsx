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
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

const FundProjectAlert = () => {
  const params = useParams<{ id: string }>();
  const { data: projectData } = useGetProjectById(params.id);

  const { data: projectMilestonesData } = useGetProjectMilestones(params.id);

  const firstFundMilestone = useMemo(
    () =>
      projectMilestonesData?.data?.data?.find?.(
        (milestone) => milestone?.transactionStatus === "AWAITING_FUND"
      ),
    [projectMilestonesData?.data?.data]
  );

  if (projectData?.data?.data?.amountFunded === 0)
    return (
      <Alert
        className="fixed w-[90vw] lg:w-[70vw] top-28 z-[50] rounded-lg shadow-md shadow-error-700/25"
        type="error"
        icon={<AlertTriangle />}
        title="Awaiting fund"
        message="fund escrow to start project"
        action={
          <div className="flex gap-1">
            <SelectFundingMethodDialog
              id={uuidToBase62Safe(firstFundMilestone?.id || "")}
              type="milestone"
            >
              <Button variant="outline" disabled={!firstFundMilestone}>
                Fund Milestone
              </Button>
            </SelectFundingMethodDialog>
            <SelectFundingMethodDialog id={params.id} type="project">
              <Button>Fund Project</Button>
            </SelectFundingMethodDialog>
          </div>
        }
      />
    );
};

export default FundProjectAlert;
