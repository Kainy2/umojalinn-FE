import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  MilestoneStatus,
  MilestoneTimelineItem,
  MilestoneTimelineProps,
} from "./Timeline";
import {
  useApproveOrRejectMilestone,
  useSubmitMilestone,
} from "@/tanstack/hooks/useProject";
import { jsonToFormData } from "@/lib/utils";
import RejectMilestoneDialog from "../dialog/RejectMilestone";

export enum MilestoneActionType {
  SUBMIT = "SUBMIT",
  REJECT = "REJECT",
}

const MilestoneAction: React.FC<
  MilestoneTimelineItem &
    Pick<MilestoneTimelineProps, "isBuyer" | "isDesigner"> & {
      message: string;
      files: FileList | null;
      clear: () => void;
    }
> = ({
  isCurrent,
  isBuyer,
  isDesigner,
  status,
  id,
  message,
  files,
  clear,
  isDelivery,
  deliverySubmission,
}) => {
  const { mutate: submitMilestone, isPending: submittingMilestone } =
    useSubmitMilestone(id, {
      onSuccess: () => {
        clear();
      },
    });

  const { mutate: approveOrRejectMilestone, isPending: isReviewingMilestone } =
    useApproveOrRejectMilestone(id);

  if (status === MilestoneStatus.IN_REVIEW && isCurrent && isBuyer)
    return (
      <>
        <Separator className="my-3" />
        <div className="flex gap-4 flex-col md:flex-row">
          <RejectMilestoneDialog id={id}>
            <Button
              disabled={isReviewingMilestone}
              size="sm"
              variant="outline"
              fullWidth
            >
              Reject
            </Button>
          </RejectMilestoneDialog>
          <Button
            size="sm"
            onClick={() =>
              approveOrRejectMilestone({
                status: "APPROVED",
              })
            }
            variant="success"
            disabled={isReviewingMilestone}
            fullWidth
          >
            Accept
          </Button>
        </div>
      </>
    );

  if (status === MilestoneStatus.ACTIVE && isCurrent && isDesigner)
    return (
      <>
        <Separator className="my-3" />
        <div className="flex gap-4 flex-col md:flex-row">
          {/* <Button size="sm" variant="outline" fullWidth>
            Cancel
          </Button> */}
          <Button
            size="sm"
            onClick={() =>
              submitMilestone(
                isDelivery
                  ? jsonToFormData(deliverySubmission || {})
                  : jsonToFormData({ description: message, media: files })
              )
            }
            variant="success"
            fullWidth
            disabled={
              submittingMilestone || (!isDelivery && (!message || !files))
            }
          >
            Submit
          </Button>
        </div>
      </>
    );
};

export default MilestoneAction;
