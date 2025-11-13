import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  UmojaLinnDeliveryMilestoneReviewProps,
  UmojaLinnMilestone,
  UmojaLinnProject,
  VariableDeliveryMileStoneSubmissions,
} from "@/types/project";

import MilestoneIndicator from "./Indicator";
import MilestonePill from "./Pill";
import MilestoneAction, { MilestoneActionType } from "./Action";
import SelectFundingMethodDialog from "../dialog/SelectFundingMethod";
import MilestoneInputSection from "./InputSection";
import MilestoneSubmissionsPreview from "./SubmissionsPreview";
import FundMilestoneDialog from "../dialog/FundMilestoneDialog";
import { UmojaLinnUser } from "@/types/user";
import { VariableDeliveryForm } from "./VariableDeliveryForm";
import { EDeliveryMileStoneType } from "@/types/enum";

export enum MilestoneStatus {
  INACTIVE = "INACTIVE",
  IN_REVIEW = "IN_REVIEW",
  ACTIVE = "ACTIVE",
  REVIEW = "REVIEW",
  AWAITING_FUND = "AWAITING_FUND",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
}

export type MilestoneTimelineItem = {
  id: string;
  title: string;
  description?: string;
  date: string;
  additionalContent?: React.ReactNode;
  isCurrent?: boolean;
  retries?: unknown[];
  amount: number;
  status?: keyof typeof MilestoneStatus;
  info?: string;
  onActionClick?: (action: MilestoneActionType) => void;
  onAcceptMilestoneSuccess?: () => void;
  isDelivery?: boolean;
  isVariableDelivery?: boolean;
  deliverySubmission?: UmojaLinnDeliveryMilestoneReviewProps;
  variableSubmissions?: VariableDeliveryMileStoneSubmissions[];
};

export type MilestoneTimelineProps = {
  milestones: UmojaLinnMilestone[];
  className?: string;
  isDesigner?: boolean;
  escrowBalance?: number;
  currency: UmojaLinnProject["currency"];
  projectId?: string;
  designer: UmojaLinnUser | null | undefined;
  buyer: UmojaLinnUser | null | undefined;
};

const getMilestoneStatus = (
  status: UmojaLinnMilestone["status"],
  transactionStatus: UmojaLinnMilestone["transactionStatus"]
): MilestoneTimelineItem["status"] => {
  if (status === "IN_ACTIVE") {
    return MilestoneStatus.INACTIVE;
  }
  if (status === "ACTIVE" || status === "REJECTED")
    return MilestoneStatus.ACTIVE;
  if (status === "APPROVED") return MilestoneStatus.COMPLETED;
  if (status === "PENDING" && transactionStatus === "AWAITING_FUND")
    return MilestoneStatus.AWAITING_FUND;
  if (transactionStatus === "PAID") return MilestoneStatus.PAID;
  if (transactionStatus === "PROCESSING") return MilestoneStatus.REVIEW;
  if (status === "IN_REVIEW") return MilestoneStatus.IN_REVIEW;
  return MilestoneStatus.INACTIVE;
};

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  className,
  escrowBalance,
  isDesigner,
  currency,
  projectId,
  designer,
  buyer
}) => {
const deliveryMilestone = milestones[milestones.length - 1];

  const [openFundMilestoneModal, setOpenFundMilestoneModal] = useState(false);
  const [openPayForMilestoneModal, setOpenPayForMilestoneModal] = useState(false)
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('')
  const [message, setMessage] = React.useState<string>('');
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [editedVariablePrice, setEditedVariablePrice] = 
  useState(deliveryMilestone.amount ?? 0)
	const [selectedVariableDeliveryMethod, setSelectedVariableDeliveryMethod] = 
  useState(deliveryMilestone.deliveryMethod ?? "IN_PERSON_PICKUP")

  const [editableDeliverySubmission, setEditableDeliverySubmission] =
    useState<UmojaLinnDeliveryMilestoneReviewProps>({
      description: "",
      city: "",
      country: "",
      state: "",
      street: "",
      zipCode: "",
      courierService: "",
      courierServiceLink: "",
      trackingId: "",
    });

    const onAcceptMilestoneSuccess = (isDelivery: boolean, index: number) => {
      if (isDelivery) return
      const nextMilestone = milestones[index + 1];
      
      if (nextMilestone.project.fundStatus === MilestoneStatus.AWAITING_FUND) {
        setOpenFundMilestoneModal(true);
        setSelectedMilestoneId(nextMilestone.id);
      }
    }

    const onAcceptVariableMilestoneSuccess = (isDelivery: boolean, deliveryMilestone: UmojaLinnMilestone) => {
      if (!isDelivery || deliveryMilestone.project.fundStatus !== MilestoneStatus.AWAITING_FUND) return

      setOpenFundMilestoneModal(true);
      setSelectedMilestoneId(deliveryMilestone.id);
    }

  return (
  <>
    <SelectFundingMethodDialog
      id={selectedMilestoneId}
      type="milestone"
      open={openPayForMilestoneModal}
      onOpenChange={setOpenPayForMilestoneModal}
    />
    <FundMilestoneDialog
      open={openFundMilestoneModal}
      setOpen={setOpenFundMilestoneModal}
      onConfirm={() => {
        setOpenFundMilestoneModal(false);
        setOpenPayForMilestoneModal(true);
      }}
    />        

    <ol className={cn("flex flex-col gap-1.5", className)}>
      {milestones.map((item, index) => {
        const isDelivery = !!item?.deliveryMethod;
        const milestone: MilestoneTimelineItem = {
          id: item?.id,
          status: getMilestoneStatus(item?.status, item?.transactionStatus),
          amount: item?.amount || 0,
          date: item?.updatedAt,
          title: item?.title || (isDelivery && "Delivery Method") || "No title",
          description: item?.description,
          variableSubmissions: item?.variableSubmissions,
          isCurrent: ["PENDING", "ACTIVE", "REJECTED", "IN_REVIEW"].includes(
            item?.status
          ),
        };

        const isVariableDelivery = item.deliveryMileStoneType === EDeliveryMileStoneType.VARIABLE 
        const isAwaitingFunding = milestone?.status === MilestoneStatus.AWAITING_FUND 
        const latestSubmission = milestone.variableSubmissions?.[0]
        const isCompletedOrCurrent =
          milestone?.status === MilestoneStatus.COMPLETED ||
          milestone?.isCurrent;
        
        return (
          <li key={index} className="flex flex-col gap-1.5">
            <div className="flex flex-row gap-3">
              {/* Circular indicator with icons */}
              <MilestoneIndicator {...milestone} />

              {/* Title */}
              <h3
                className={cn(
                  "flex-1 font-semibold text-gray-400 mt-1 truncate",
                  isCompletedOrCurrent && "text-foreground-body"
                )}
              >
                {milestone?.title}
              </h3>
            </div>
            <div className="flex flex-row items-stretch gap-3">
              {/* Line indicator */}
              <span
                className={cn(
                  "flex flex-col justify-center items-center w-8 shrink-0 before:content-[''] before:w-0.5 before:h-full before:bg-gray-200 before:flex-1 before:rounded-full ",
                  milestone?.status === MilestoneStatus.COMPLETED &&
                    "before:bg-success",
                  milestone?.isCurrent && "before:bg-gray-500"
                )}
              />
              {/* Details, actions and content */}
              <div className="flex-1 flex flex-col gap-2">
                <p
                  className={cn(
                    "text-gray-400",
                    isCompletedOrCurrent && "text-foreground-body"
                  )}
                >
                  {milestone?.description}
                  {/* {isDelivery && (
                    <>
                      Delivery method{" "}
                      <span className="text-xs py-1 px-2 border rounded-sm">
                        {capitalizeFirstLetter(
                          item?.deliveryMethod || "IN_PERSON_PICKUP"
                        ).replaceAll("_", " ")}
                      </span>
                    </>
                  )} */}
                </p>
                {milestone?.additionalContent}

                <VariableDeliveryForm
                  isAwaitingFunding={isAwaitingFunding}
                  milestoneId={item?.id}
                  isVariableDelivery={isVariableDelivery}
                  isDesigner={!!isDesigner}
                  isDeliveryMilestone={isDelivery}
                  variableSubmissions={item?.variableSubmissions}
                  currency={currency ?? 'NAIRA'}
                  isCurrentMilestone={!!milestone?.isCurrent}
                  editedVariablePrice={editedVariablePrice}
                  setEditedVariablePrice={setEditedVariablePrice}
                  selectedVariableDeliveryMethod={selectedVariableDeliveryMethod}
                  setSelectedVariableDeliveryMethod={setSelectedVariableDeliveryMethod}
                />

                <MilestoneSubmissionsPreview
                  status={milestone?.status}
                  milestoneId={item?.id}
                  deliveryMethod={item?.deliveryMethod}
                  isDeliveryMilestone={isDelivery}
                  isFixedDelivery={!isVariableDelivery}
                  {...{
                    // isBuyer,
                    isDesigner,
                    designer,
                    buyer,
                  }}
                />
                {/* Input */}
                {isDesigner && ( 
                  <MilestoneInputSection
                    {...{
                      isDesigner,
                      // isBuyer,
                      message,
                      files,
                      status: milestone?.status,
                      onFilesChange: setFiles,
                      onMessageChange: setMessage,
                      isDeliveryMilestone: isDelivery,
                      deliveryMethod: item?.deliveryMethod,
                      editedDeliveryDetails: editableDeliverySubmission,
                      onChangeDeliveryDetails: (value) =>
                        setEditableDeliverySubmission((prev) => ({
                          ...prev,
                          ...value,
                        })),
                    }}
                  />
                )}
                <div
                  className={cn(
                    "flex gap-2 flex-wrap items-center text-sm",
                    isCompletedOrCurrent && "text-foreground-body"
                  )}
                >
                  {milestone?.date && isCompletedOrCurrent && (
                    <time
                      className={cn(
                        "text-gray-400 text-sm",
                        isCompletedOrCurrent && "text-foreground-body"
                      )}
                    >
                      {format(
                        new Date(milestone?.date),
                        "MMM dd, yyyy • hh:mmaaa"
                      )}
                    </time>
                  )}
                  <MilestonePill currency={currency} escrowBalance={escrowBalance} {...milestone} />
                  {isAwaitingFunding && latestSubmission?.status !== "PENDING" &&
                    !isDesigner && (
                      <SelectFundingMethodDialog
                        id={milestone?.id}
                        type="milestone"
                      >
                        <button className="text-sm underline text-primary">
                          Fund Milestone
                        </button>
                      </SelectFundingMethodDialog>
                    )}
                  {(milestone?.retries?.length ?? 0) > 1 && (
                    <>
                      <span
                        className={cn(
                          "text-gray-400",
                          (milestone?.status === MilestoneStatus.COMPLETED ||
                            milestone?.isCurrent) &&
                            "text-foreground-body"
                        )}
                      >
                        {milestone?.retries?.length}{" "}
                      </span>
                      <button className="text-sm underline text-primary">
                        retries
                      </button>
                    </>
                  )}
                  <span
                    className={cn(
                      "text-gray-400",
                      (milestone?.status === MilestoneStatus.COMPLETED ||
                        milestone?.isCurrent) &&
                        "text-foreground-body"
                    )}
                  >
                    {milestone?.info}
                  </span>
                </div>
                <MilestoneAction
                  {...milestone}
                  message={message}
                  files={files}
                  clear={() => {
                    setMessage("");
                    setFiles(null);
                  }}
                  deliverySubmission={editableDeliverySubmission}
                  variableSubmissions={item?.variableSubmissions}
                  isAwaitingFunding={false}
                  onActionClick={(action) => console.log(action)}
                  onAcceptMilestoneSuccess={()=> onAcceptMilestoneSuccess(isDelivery, index)}
                  onAcceptVariableMilestoneSuccess={(deliveryMilestone) => 
                    onAcceptVariableMilestoneSuccess(isDelivery, deliveryMilestone)
                  }
                  {...{
                      isDesigner,
                      isDelivery,
                      projectId,
                      isVariableDelivery,
                      editedVariablePrice,
                      selectedVariableDeliveryMethod,
                  }}
                />
              </div>
            </div>
          </li>

        );
      })}
    </ol>
  </>

  );
};

export default MilestoneTimeline;
