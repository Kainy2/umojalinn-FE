import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  UmojaLinnDeliveryMilestoneReviewProps,
  UmojaLinnMilestone,
  UmojaLinnProject,
  VariableDeliveryMileStoneSubmissions,
} from "@/types/project";
import ClipboardSearch from "@/assets/ClipboardSearch";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MilestoneCancellationRequestDialog } from "@/components/custom/dialog/MilestoneCancellationRequest";
import MilestoneIndicator from "./Indicator";
import MilestonePill from "./Pill";
import MilestoneAction, { MilestoneActionType } from "./Action";
import MilestoneInputSection from "./InputSection";
import MilestoneSubmissionsPreview from "./SubmissionsPreview";
import { UmojaLinnUser } from "@/types/user";
import { VariableDeliveryForm } from "./VariableDeliveryForm";
import { EDeliveryMileStoneType, EMileStoneStatus } from "@/types/enum";
import { useFundMilestone } from "@/tanstack/hooks/useProject";
import { canBuyerFundMilestone } from "@/components/util/milestone";

export enum MilestoneStatus {
  INACTIVE = "INACTIVE",
  IN_REVIEW = "IN_REVIEW",
  ACTIVE = "ACTIVE",
  REVIEW = "REVIEW",
  AWAITING_FUND = "AWAITING_FUND",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING",
  DISPUTED = "DISPUTED",
  REFUNDED = "REFUNDED",
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
  disableDesignerSubmission?: boolean;
  escrowBalance?: number;
  currency: UmojaLinnProject["currency"];
  projectId?: string;
  projectName?: string;
  designer: UmojaLinnUser | null | undefined;
  buyer: UmojaLinnUser | null | undefined;
  /** When true, timeline is greyed out and non-interactive */
  disabled?: boolean;
};

const getMilestoneStatus = (
  status: UmojaLinnMilestone["status"],
  transactionStatus: UmojaLinnMilestone["transactionStatus"],
): MilestoneTimelineItem["status"] => {
  if (status === EMileStoneStatus.IN_ACTIVE) {
    return MilestoneStatus.INACTIVE;
  }
  if (status === EMileStoneStatus.DISPUTED) {
    return MilestoneStatus.DISPUTED;
  }
  if (status === EMileStoneStatus.REFUNDED) {
    return MilestoneStatus.REFUNDED;
  }
  if (
    status === EMileStoneStatus.ACTIVE ||
    status === EMileStoneStatus.REJECTED
  ) {
    return MilestoneStatus.ACTIVE;
  }
  if (status === EMileStoneStatus.APPROVED) {
    return MilestoneStatus.COMPLETED;
  }
  if (
    status === EMileStoneStatus.PENDING &&
    transactionStatus === "AWAITING_FUND"
  ) {
    return MilestoneStatus.AWAITING_FUND;
  }
  if (transactionStatus === "PAID") return MilestoneStatus.PAID;
  if (transactionStatus === "PROCESSING") {
    return MilestoneStatus.PROCESSING;
  }
  if (status === EMileStoneStatus.IN_REVIEW) {
    return MilestoneStatus.IN_REVIEW;
  }
  return MilestoneStatus.INACTIVE;
};

const CURRENT_MILESTONE_STATUSES: UmojaLinnMilestone["status"][] = [
  EMileStoneStatus.PENDING,
  EMileStoneStatus.ACTIVE,
  EMileStoneStatus.REJECTED,
  EMileStoneStatus.IN_REVIEW,
  EMileStoneStatus.DISPUTED,
];

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  className,
  escrowBalance,
  isDesigner,
  currency,
  projectId,
  projectName,
  designer,
  buyer,
  disabled = false,
  disableDesignerSubmission = false,
}) => {
  const deliveryMilestone = !!milestones.length
    ? milestones[milestones.length - 1]
    : undefined;

  // const [openFundMilestoneModal, setOpenFundMilestoneModal] = useState(false);
  // const [openPayForMilestoneModal, setOpenPayForMilestoneModal] = useState(false)
  // const [selectedMilestoneId, setSelectedMilestoneId] = useState('')
  const [message, setMessage] = React.useState<string>("");
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [editedVariablePrice, setEditedVariablePrice] = useState(
    deliveryMilestone?.amount ?? 0,
  );
  const [selectedVariableDeliveryMethod, setSelectedVariableDeliveryMethod] =
    useState(deliveryMilestone?.deliveryMethod ?? "IN_PERSON_PICKUP");

  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [cancellationMilestone, setCancellationMilestone] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleCancellationOpenChange = (open: boolean) => {
    setCancellationOpen(open);
  };

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
    if (isDelivery) return;
    const nextMilestone = milestones[index + 1];

    if (nextMilestone.project.fundStatus === MilestoneStatus.AWAITING_FUND) {
      // setOpenFundMilestoneModal(true);
      // setSelectedMilestoneId(nextMilestone.id);
    }
  };

  const onAcceptVariableMilestoneSuccess = (
    isDelivery: boolean,
    deliveryMilestone: UmojaLinnMilestone,
  ) => {
    if (deliveryMilestone.project.fundStatus !== MilestoneStatus.AWAITING_FUND)
      return;

    // setOpenFundMilestoneModal(true);
    // setSelectedMilestoneId(deliveryMilestone.id);
  };
  const fundMilestone = useFundMilestone({
    onSuccess: (data) => {
      const url = data?.data?.data?.checkoutUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <>
      <ol
        className={cn(
          "flex flex-col gap-1.5",
          disabled && "opacity-50 pointer-events-none select-none",
          className,
        )}
      >
        {milestones.map((item, index) => {
          const isDelivery = !!item?.deliveryMethod;
          const milestone: MilestoneTimelineItem = {
            id: item?.id,
            status: getMilestoneStatus(item?.status, item?.transactionStatus),
            amount: item?.amount || 0,
            date: item?.updatedAt,
            title:
              item?.title || (isDelivery && "Delivery Method") || "No title",
            description: item?.description,
            variableSubmissions: item?.variableSubmissions,
            isCurrent: CURRENT_MILESTONE_STATUSES.includes(item?.status),
          };

          const isVariableDelivery =
            item.deliveryMileStoneType === EDeliveryMileStoneType.VARIABLE;
          const isAwaitingFunding =
            milestone?.status === MilestoneStatus.AWAITING_FUND;
          const latestSubmission = milestone.variableSubmissions?.[0];
          const isCompletedOrCurrent =
            milestone?.status === MilestoneStatus.COMPLETED ||
            milestone?.status === MilestoneStatus.REFUNDED ||
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
                    isCompletedOrCurrent && "text-foreground-body",
                  )}
                >
                  {milestone?.title}
                </h3>
                {isDesigner && milestone?.isCurrent && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="shrink-0 rounded-sm outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        aria-label="Milestone actions"
                      >
                        <MoreVertical className="text-primary cursor-pointer" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem
                        className="cursor-pointer gap-1 text-[#B54708]"
                        onSelect={() => {
                          setCancellationMilestone({
                            id: milestone.id,
                            title: milestone.title,
                          });
                          window.setTimeout(() => setCancellationOpen(true), 0);
                        }}
                      >
                        <ClipboardSearch />
                        Cancel Milestone
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex flex-row items-stretch gap-3">
                {/* Line indicator */}
                <span
                  className={cn(
                    "flex flex-col justify-center items-center w-8 shrink-0 before:content-[''] before:w-0.5 before:h-full before:bg-gray-200 before:flex-1 before:rounded-full ",
                    (milestone?.status === MilestoneStatus.COMPLETED ||
                      milestone?.status === MilestoneStatus.REFUNDED) &&
                      "before:bg-success",
                    milestone?.isCurrent && "before:bg-gray-500",
                  )}
                />
                {/* Details, actions and content */}
                <div className="flex-1 flex flex-col gap-2">
                  <p
                    className={cn(
                      "text-gray-400",
                      isCompletedOrCurrent && "text-foreground-body",
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
                    currency={currency ?? "NAIRA"}
                    isCurrentMilestone={!!milestone?.isCurrent}
                    editedVariablePrice={editedVariablePrice}
                    setEditedVariablePrice={setEditedVariablePrice}
                    selectedVariableDeliveryMethod={
                      selectedVariableDeliveryMethod
                    }
                    setSelectedVariableDeliveryMethod={
                      setSelectedVariableDeliveryMethod
                    }
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
                      isCompletedOrCurrent && "text-foreground-body",
                    )}
                  >
                    {milestone?.date && isCompletedOrCurrent && (
                      <time
                        className={cn(
                          "text-gray-400 text-sm",
                          isCompletedOrCurrent && "text-foreground-body",
                        )}
                      >
                        {format(
                          new Date(milestone?.date),
                          "MMM dd, yyyy • hh:mmaaa",
                        )}
                      </time>
                    )}
                    <MilestonePill
                      currency={currency}
                      escrowBalance={escrowBalance}
                      isDesigner={isDesigner}
                      {...milestone}
                    />
                    {(isAwaitingFunding ||
                      milestone?.status === MilestoneStatus.PROCESSING) &&
                      canBuyerFundMilestone({
                        isVariableDelivery,
                        variableSubmissionStatus: latestSubmission?.status,
                      }) &&
                      !isDesigner && (
                        <button
                          className="text-sm underline text-primary"
                          onClick={() => {
                            fundMilestone.mutate(milestone?.id);
                          }}
                        >
                          Fund Milestone
                        </button>
                      )}
                    {(milestone?.retries?.length ?? 0) > 1 && (
                      <>
                        <span
                          className={cn(
                            "text-gray-400",
                            (milestone?.status === MilestoneStatus.COMPLETED ||
                              milestone?.status === MilestoneStatus.REFUNDED ||
                              milestone?.isCurrent) &&
                              "text-foreground-body",
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
                          "text-foreground-body",
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
                    disableDesignerSubmission={disableDesignerSubmission}
                    onActionClick={(action) => console.log(action)}
                    onAcceptMilestoneSuccess={() =>
                      onAcceptMilestoneSuccess(isDelivery, index)
                    }
                    onAcceptVariableMilestoneSuccess={(deliveryMilestone) =>
                      onAcceptVariableMilestoneSuccess(
                        isDelivery,
                        deliveryMilestone,
                      )
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

      {cancellationMilestone && (
        <MilestoneCancellationRequestDialog
          milestoneId={cancellationMilestone.id}
          projectName={projectName ?? "Project"}
          milestoneName={cancellationMilestone.title}
          escrowAmount={escrowBalance ?? 0}
          currency={currency}
          open={cancellationOpen}
          onOpenChange={handleCancellationOpenChange}
        />
      )}
    </>
  );
};

export default MilestoneTimeline;
