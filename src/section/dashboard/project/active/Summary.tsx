"use client";
import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import SectionTitle from "@/components/custom/SectionTitle";
import { uuidToBase62Safe } from "@/lib/uuid";
import { RefundRequestDialog } from "@/components/custom/dialog/RefundRequest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClipboardSearch from "@/assets/ClipboardSearch";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
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
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const { data, isPending } = useGetProjectById(params?.id);
  const { data: milestonesData } = useGetProjectMilestones(params?.id);

  const project = data?.data?.data;
  const milestoneOptions = useMemo(
    () =>
      (milestonesData?.data?.data ?? []).map((milestone) => ({
        id: milestone.id,
        title: milestone.title ?? "",
      })),
    [milestonesData?.data?.data],
  );

  if (isPending) {
    return "";
  }
  return (
    <div className="flex flex-col">
      <SectionTitle
        size="large"
        action={
          <>
            <DropdownMenu open={actionsMenuOpen} onOpenChange={setActionsMenuOpen}>
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
              </DropdownMenuContent>
            </DropdownMenu>
            {project && (
              <RefundRequestDialog
                open={refundOpen}
                onOpenChange={setRefundOpen}
                projectId={project.id}
                projectName={project.title || "No Title"}
                milestones={milestoneOptions}
                fullRefundAmount={project.escrowBalance || 0}
                currency={project.currency}
              />
            )}
          </>
        }
        title={data?.data?.data?.title || "No Title"}
      />
      <div className="grid grid-cols-1  md:grid-cols-2 gap-2 md:gap-4 max-w-screen-sm items-center justify-start">
        <span className="text-sm text-foreground-body">
          {!isDesigner ? "Designer" : "Client"}
        </span>
        <span>
          <AvatarIconTag
            disabled={isDesigner}
            onClick={
              !isDesigner
                ? () =>
                    router.push(
                      `/designers/${uuidToBase62Safe(data?.data?.data?.designer?.user?.id || "")}`,
                    )
                : undefined
            }
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
