import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
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
import ReviewDialog from "../dialog/Review";
import {
  useAddVariableDeliveryMilestone,
  useApproveOrRejectVariableDeliveryMilestone,
} from "@/tanstack/hooks/useBid";
import { UmojaLinnDeliveryMethod, UmojaLinnMilestone } from "@/types/project";

export enum MilestoneActionType {
  SUBMIT = "SUBMIT",
  REJECT = "REJECT",
}

const MilestoneAction: React.FC<
  MilestoneTimelineItem &
    Pick<
      MilestoneTimelineProps,
      "isDesigner" | "projectId" | "disableDesignerSubmission"
    > & {
      message: string;
      files: FileList | null;
      clear: () => void;
      editedVariablePrice: number;
      selectedVariableDeliveryMethod: UmojaLinnDeliveryMethod;
      isAwaitingFunding: boolean;
      onAcceptVariableMilestoneSuccess: (
        deliveryMilestone: UmojaLinnMilestone,
      ) => void;
    }
> = ({
  isCurrent,
  isAwaitingFunding,
  isDesigner,
  status,
  id,
  message,
  files,
  clear,
  isDelivery,
  deliverySubmission,
  projectId,
  onAcceptMilestoneSuccess,
  onAcceptVariableMilestoneSuccess,
  variableSubmissions,
  isVariableDelivery,
  editedVariablePrice,
  selectedVariableDeliveryMethod,
  disableDesignerSubmission,
}) => {
  const [isDecisionAccepting, setIsDecisionAccepting] = useState(false);
  const currentVariableSubmission = variableSubmissions?.[0];
  const isNoSubmission =
    !variableSubmissions?.length ||
    currentVariableSubmission?.status === "REJECTED";

  const isDisputed = status === MilestoneStatus.DISPUTED;
  const isAcceptingVariableDelivery =
    isVariableDelivery &&
    !isDisputed &&
    currentVariableSubmission?.status === "PENDING";
  const isSubmittingVariableType =
    isVariableDelivery &&
    !isDisputed &&
    isNoSubmission &&
    !isAwaitingFunding;

  const { mutate: submitMilestone, isPending: isSubmittingMilestone } =
    useSubmitMilestone(id, {
      onSuccess: () => {
        clear();
      },
    });

  const [openReview, setOpenReview] = React.useState(false);

  const { mutate: approveOrRejectMilestone, isPending: isReviewingMilestone } =
    useApproveOrRejectMilestone(id, {
      onSuccess: () => {
        if (isDelivery) setOpenReview(true);
      },
    });

  const {
    mutate: decideVariableDeliveryMilestone,
    isPending: isPendingDecideVariableDelivery,
  } = useApproveOrRejectVariableDeliveryMilestone(id, {
    onSuccess: ({ data }) => {
      if (!isDecisionAccepting) return;

      onAcceptVariableMilestoneSuccess(data.data);
    },
  });

  const {
    mutate: addVariableDeliveryMilestone,
    isPending: isPendingAddVariableDelivery,
  } = useAddVariableDeliveryMilestone(id);

  if (
    (status === MilestoneStatus.IN_REVIEW || isAcceptingVariableDelivery) &&
    isCurrent &&
    !isDesigner
  )
    return (
      <>
        <Separator className="my-3" />
        <div
          id="tour-active-project-milestone-approval"
          className="flex gap-4 flex-col md:flex-row"
        >
          <RejectMilestoneDialog
            isAcceptingVariableDelivery={isAcceptingVariableDelivery}
            id={id}
          >
            <Button
              disabled={isReviewingMilestone || isPendingDecideVariableDelivery}
              loading={isPendingDecideVariableDelivery && !isDecisionAccepting}
              onClick={() => {
                if (!isAcceptingVariableDelivery) return;

                setIsDecisionAccepting(false);
                decideVariableDeliveryMilestone({ status: "REJECTED" });
              }}
              size="sm"
              variant="outline"
              fullWidth
            >
              Reject
            </Button>
          </RejectMilestoneDialog>
          <Button
            size="sm"
            onClick={() => {
              if (isAcceptingVariableDelivery) {
                setIsDecisionAccepting(true);
                decideVariableDeliveryMilestone({ status: "APPROVED" });
              } else {
                approveOrRejectMilestone(
                  { status: "APPROVED" },
                  { onSuccess: onAcceptMilestoneSuccess },
                );
              }
            }}
            variant="success"
            loading={
              isReviewingMilestone ||
              (isPendingDecideVariableDelivery && isDecisionAccepting)
            }
            fullWidth
          >
            Accept
          </Button>
        </div>
      </>
    );

  if (
    (status === MilestoneStatus.ACTIVE || isSubmittingVariableType) &&
    isCurrent &&
    isDesigner
  )
    return (
      <>
        <Separator className="my-3" />
        <div className="flex gap-4 flex-col md:flex-row">
          <Button
            size="sm"
            onClick={() => {
              if (disableDesignerSubmission) return;

              if (isSubmittingVariableType) {
                addVariableDeliveryMilestone({
                  amount: Number(editedVariablePrice),
                  deliveryMethod: selectedVariableDeliveryMethod,
                });
              } else {
                submitMilestone(
                  isDelivery
                    ? jsonToFormData(deliverySubmission || {})
                    : jsonToFormData({ description: message, media: files }),
                  // ...(files ? { media: files } : {}),
                );
              }
            }}
            variant="success"
            fullWidth
            disabled={disableDesignerSubmission || (!isDelivery && !message)}
            loading={isSubmittingMilestone || isPendingAddVariableDelivery}
          >
            Submit {isSubmittingVariableType && "Delivery Method"}
          </Button>
        </div>
      </>
    );

  if (isDelivery) {
    return (
      <ReviewDialog
        reviewType="EXPERIENCE"
        projectId={projectId || ""}
        open={openReview}
        onOpenChange={setOpenReview}
        fullWidthActions
        hideCancel
        confirmText="Submit"
        persist
      />
    );
  }
};

export default MilestoneAction;
