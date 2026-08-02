"use client";
import Alert from "@/components/custom/Alert";
import ActiveProjectFundPlaceholder from "@/components/tour/ActiveProjectFundPlaceholder";
import FundingFeesDialog from "@/components/custom/dialog/FundingFeesDialog";

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
import { canBuyerFundMilestone } from "@/components/util/milestone";
import { EDeliveryMileStoneType, EMileStoneStatus } from "@/types/enum";
import { useFundingFeesCheckout } from "@/hooks/useFundingFeesCheckout";

const FundProjectAlert = () => {
  const pathname = usePathname();
  const { data: me } = useSession();
  const params = useParams<{ id: string }>();
  const { data: projectData } = useGetProjectById(params?.id);

  const { data: projectMilestonesData } = useGetProjectMilestones(params?.id);

  const {
    feesDialogOpen,
    setFeesDialogOpen,
    payment,
    handleFundSuccess,
    handleProceedToCheckout,
  } = useFundingFeesCheckout();

  const firstFundMilestone = useMemo(
    () =>
      projectMilestonesData?.data?.data?.find?.(
        (milestone) => milestone?.status === EMileStoneStatus.PENDING,
      ),
    [projectMilestonesData?.data?.data],
  );

  const isDesigner = me?.user?.profileRole === "DESIGNER";
  const excludedPaths = ["ads", "completed", "bids", "drafts"];
  const isExcludedPath = excludedPaths.some((path) => pathname.includes(path));
  const fundStatus = projectData?.data?.data?.fundStatus;
  const isUnfunded = Number(projectData?.data?.data?.amountFunded) === 0;
  const needsFunding =
    fundStatus === "AWAITING_FUND" || fundStatus === "PROCESSING";
  const canFundFirstMilestone =
    !!firstFundMilestone &&
    canBuyerFundMilestone({
      isVariableDelivery:
        firstFundMilestone.deliveryMileStoneType ===
        EDeliveryMileStoneType.VARIABLE,
      variableSubmissionStatus:
        firstFundMilestone.variableSubmissions?.[0]?.status,
    });
  const fundMilestone = useFundMilestone({
    onSuccess: (data) => {
      handleFundSuccess(data?.data?.data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const fundProject = useFundProject(params.id, {
    onSuccess: (data) => {
      handleFundSuccess(data?.data?.data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (isExcludedPath || isDesigner) {
    return null;
  }

  const shouldShowFundAlert = needsFunding && isUnfunded;

  if (shouldShowFundAlert) {
    return (
      <div id="tour-active-project-fund">
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
                disabled={!canFundFirstMilestone}
                loading={fundMilestone.isPending}
                onClick={() => fundMilestone.mutate(firstFundMilestone?.id || "")}
              >
                Fund Milestone
              </Button>
              <Button
                className="w-full md:w-auto"
                loading={fundProject.isPending}
                onClick={() => fundProject.mutate()}
              >
                Fund Project
              </Button>
            </div>
          }
        />
        <FundingFeesDialog
          open={feesDialogOpen}
          onOpenChange={setFeesDialogOpen}
          fees={payment?.fees}
          currency={payment?.currency}
          onProceed={handleProceedToCheckout}
        />
      </div>
    );
  }

  return <ActiveProjectFundPlaceholder />;
};

export default FundProjectAlert;
