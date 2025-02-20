import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  UmojaLinnDeliveryMilestoneReviewProps,
  UmojaLinnMilestone,
  UmojaLinnProject,
} from "@/types/project";

import MilestoneIndicator from "./Indicator";
import MilestonePill from "./Pill";
import MilestoneAction, { MilestoneActionType } from "./Action";
import SelectFundingMethodDialog from "../dialog/SelectFundingMethod";
import MilestoneInputSection from "./InputSection";
import MilestoneSubmissionsPreview from "./SubmissionsPreview";
import { capitalizeFirstLetter } from "@/lib/string";

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
  isDelivery?: boolean;
  deliverySubmission?: UmojaLinnDeliveryMilestoneReviewProps;
};

export type MilestoneTimelineProps = {
  milestones: UmojaLinnMilestone[];
  className?: string;
  isDesigner?: boolean;
  isBuyer?: boolean;
  currency: UmojaLinnProject["currency"];
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
  isBuyer,
  isDesigner,
  currency,
}) => {
  const [message, setMessage] = React.useState<string>("");
  const [files, setFiles] = React.useState<FileList | null>(null);
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

  return (
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
          isCurrent: ["PENDING", "ACTIVE", "REJECTED", "IN_REVIEW"].includes(
            item?.status
          ),
        };
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
                  {isDelivery && (
                    <>
                      Delivery method{" "}
                      <span className="text-xs py-1 px-2 border rounded-sm">
                        {capitalizeFirstLetter(
                          item?.deliveryMethod || "IN_PERSON_PICKUP"
                        ).replaceAll("_", " ")}
                      </span>
                    </>
                  )}
                </p>
                {milestone?.additionalContent}
                <MilestoneSubmissionsPreview
                  status={milestone?.status}
                  milestoneId={item?.id}
                  {...{
                    isBuyer,
                    isDesigner,
                  }}
                />
                {/* Input */}
                <MilestoneInputSection
                  {...{
                    isDesigner,
                    isBuyer,
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
                  <MilestonePill currency={currency} {...milestone} />
                  {milestone?.status === MilestoneStatus.AWAITING_FUND &&
                    isBuyer && (
                      <SelectFundingMethodDialog
                        id={milestone?.id}
                        type="milestone"
                      >
                        <button className="text-sm underline text-primary">
                          Fund Milestone
                        </button>
                      </SelectFundingMethodDialog>
                    )}
                  {(milestone?.retries?.length || 0) > 1 && (
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
                  {...{ isBuyer, isDesigner, isDelivery }}
                  onActionClick={(action) => {
                    console.log(action);
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default MilestoneTimeline;
