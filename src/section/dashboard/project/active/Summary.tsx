"use client";
import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import SectionTitle from "@/components/custom/SectionTitle";
import { uuidToBase62Safe } from "@/lib/uuid";
import { RefundRequestDialog } from "@/components/custom/dialog/RefundRequest";
import { BuyerProjectIssueDialog } from "@/components/custom/dialog/BuyerProjectIssue";
import { BuyerIssueConfirmDialog } from "@/components/custom/dialog/BuyerIssueConfirm";
import { TBuyerProjectIssueFormData } from "@/components/custom/dialog/BuyerProjectIssue/@types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClipboardSearch from "@/assets/ClipboardSearch";
import {
  getActiveDisputedMilestoneIds,
  isMilestoneEligibleForDispute,
} from "@/lib/dispute";
import { formatMilestoneSelectLabel } from "@/components/util/milestone";
import { useCreateBuyerDispute, useGetProjectDisputes } from "@/tanstack/hooks/useDispute";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import { BUYER_ISSUE_REASONS } from "@/types/dispute";
import { format } from "date-fns";
import { CalendarPlus, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { SizingTemplatePill } from "@/components/sizing-template";
import { useRouter } from "next/navigation";

type ActiveProjectSummaryProps = {
  isDesigner?: boolean;
};

const ActiveProjectSummary = (props: ActiveProjectSummaryProps) => {
  const { isDesigner = false } = props;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [refundOpen, setRefundOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingIssue, setPendingIssue] =
    useState<TBuyerProjectIssueFormData | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const { data, isPending } = useGetProjectById(params?.id);
  const { data: milestonesData } = useGetProjectMilestones(params?.id);
  const { data: projectDisputesResponse } = useGetProjectDisputes(
    params?.id ?? "",
    {
      enabled: !!params?.id && !isDesigner,
    },
  );

  const { mutate: createBuyerDispute, isPending: isCreatingBuyerDispute } =
    useCreateBuyerDispute({
      onSuccess: () => {
        setPendingIssue(null);
        setConfirmOpen(false);
        setIssueOpen(false);
      },
    });

  const project = data?.data?.data;
  const milestones = milestonesData?.data?.data ?? [];
  const milestoneOptions = useMemo(
    () =>
      milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title ?? "",
        amount: Number(milestone.amount) || 0,
      })),
    [milestones],
  );

  const issueMilestoneOptions = useMemo(() => {
    const disputedMilestoneIds = getActiveDisputedMilestoneIds(
      projectDisputesResponse?.data?.data ?? [],
    );

    return milestones
      .filter((milestone) =>
        isMilestoneEligibleForDispute(milestone, disputedMilestoneIds),
      )
      .map((milestone) => ({
        id: milestone.id,
        title: formatMilestoneSelectLabel(milestone, milestones),
        amount: Number(milestone.amount) || 0,
      }));
  }, [milestones, projectDisputesResponse?.data?.data]);

  const designerName = useMemo(() => {
    const user = project?.designer?.user;
    if (!user) return "The designer";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "The designer";
  }, [project?.designer?.user]);

  const canRaiseIssue = !isDesigner && issueMilestoneOptions.length > 0;
  const showActionsMenu = isDesigner || canRaiseIssue;

  const handleIssueOpenChange = (open: boolean) => {
    setIssueOpen(open);
    if (!open) setPendingIssue(null);
  };

  const handleRaiseIssue = () => {
    setActionsMenuOpen(false);
    window.setTimeout(() => setIssueOpen(true), 0);
  };

  const handleProjectIssueSubmit = (formData: TBuyerProjectIssueFormData) => {
    setPendingIssue(formData);
    setIssueOpen(false);
    window.setTimeout(() => setConfirmOpen(true), 0);
  };

  const handleConfirmRaiseIssue = () => {
    if (!pendingIssue) return;

    const reasonLabel =
      BUYER_ISSUE_REASONS.find((item) => item.value === pendingIssue.reason)
        ?.label ?? pendingIssue.reason;

    createBuyerDispute({
      type: "BUYER_ISSUE",
      milestoneIds: pendingIssue.milestoneIds,
      reasonCategory: reasonLabel,
      reasonDetail: reasonLabel,
      attachmentFiles: pendingIssue.files ?? undefined,
      requestedRefundAmount: 0,
    });
  };

  const handleConfirmOpenChange = (open: boolean) => {
    setConfirmOpen(open);
    if (!open && !isCreatingBuyerDispute) {
      setPendingIssue(null);
    }
  };

  if (isPending) {
    return "";
  }
  return (
    <div className="flex flex-col">
      <SectionTitle
        size="large"
        action={
          showActionsMenu ? (
            <>
              <DropdownMenu
                open={actionsMenuOpen}
                onOpenChange={setActionsMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="shrink-0 bg-[#FEFBE8] rounded-sm p-2 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Project action"
                  >
                    <MoreVertical className="cursor-pointer text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {isDesigner && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-1 text-[#B54708]"
                      onSelect={() => {
                        setActionsMenuOpen(false);
                        window.setTimeout(() => setRefundOpen(true), 0);
                      }}
                    >
                      <ClipboardSearch />
                      Refund Buyer
                    </DropdownMenuItem>
                  )}
                  {canRaiseIssue && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-1 text-[#B54708]"
                      onSelect={handleRaiseIssue}
                    >
                      <ClipboardSearch />
                      Raise an issue
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {isDesigner && project && (
                <RefundRequestDialog
                  open={refundOpen}
                  onOpenChange={setRefundOpen}
                  projectId={project.id}
                  projectName={project.title || "No Title"}
                  milestones={milestoneOptions}
                  currency={project.currency}
                />
              )}
              {!isDesigner && project && (
                <>
                  <BuyerProjectIssueDialog
                    projectName={project.title || "No Title"}
                    milestones={issueMilestoneOptions}
                    open={issueOpen}
                    onOpenChange={handleIssueOpenChange}
                    onSubmit={handleProjectIssueSubmit}
                  />
                  <BuyerIssueConfirmDialog
                    designerName={designerName}
                    open={confirmOpen}
                    onOpenChange={handleConfirmOpenChange}
                    onConfirm={handleConfirmRaiseIssue}
                    isPending={isCreatingBuyerDispute}
                  />
                </>
              )}
            </>
          ) : undefined
        }
        title={data?.data?.data?.title || "No Title"}
      />
      <div className="grid grid-cols-1  md:grid-cols-2 gap-2 md:gap-4 max-w-screen-sm items-center justify-start">
        <span className="text-sm text-foreground-body">
          {!isDesigner ? "Designer" : "Client"}
        </span>
        <span>
          <AvatarIconTag
            // disabled={isDesigner}
            // onClick={
            //   !isDesigner
            //     ? () =>
            //         router.push(
            //           `/designers/${uuidToBase62Safe(data?.data?.data?.designer?.user?.id || "")}`,
            //         )
            //     : undefined
            // }
          onClick={() => router.push(
            isDesigner
            ? '/settings/profile'
            :`/designers/${uuidToBase62Safe(data?.data?.data?.designer?.user?.id || "")}`
          )}
            label={
              !isDesigner
                ? `${data?.data?.data?.designer?.user?.firstName || ""} ${
                    data?.data?.data?.designer?.user?.lastName || ""
                  }`
                : `${data?.data?.data?.buyer?.user?.firstName || ""} ${
                    data?.data?.data?.buyer?.user?.lastName || ""
                  }`
            }
            avatar={{
              src: !isDesigner
                ? data?.data?.data?.designer?.user?.profilePhotoUri
                : data?.data?.data?.buyer?.user?.profilePhotoUri,
            }}
          />
        </span>
        <span className="text-sm text-foreground-body">Sizing Template</span>
        <span className="relative">
          <SizingTemplatePill projectId={params?.id} />
        </span>
        <span className="text-sm text-foreground-body">Timeline</span>
        <span>
          <AvatarIconTag
            disabled
            label={`${format(
              new Date(data?.data.data?.bidAcceptedDate || 0),
              "MMM dd, yyy",
            )} to ${format(
              new Date(data?.data.data?.dueDate || 0),
              "MMM dd, yyy",
            )}`}
            icon={<CalendarPlus className="text-primary h-5 w-5" />}
          />
        </span>
      </div>
    </div>
  );
};

export default ActiveProjectSummary;
