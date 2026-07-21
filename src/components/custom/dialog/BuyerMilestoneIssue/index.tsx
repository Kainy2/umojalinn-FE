"use client";

import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CustomSelectField } from "@/components/custom/Select";
import MilestoneInputSectionImageUpload from "@/components/custom/picker/MilestoneInputSectionImageUpload";
import { useCreateBuyerDispute } from "@/tanstack/hooks/useDispute";
import ClipboardSearch from "@/assets/ClipboardSearch";
import { BUYER_ISSUE_REASONS, TBuyerIssueReason } from "@/types/dispute";
import { IBuyerMilestoneIssueDialogProps } from "./@types";

export const BuyerMilestoneIssueDialog = ({
  milestoneId,
  projectName,
  milestoneName,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...dialogProps
}: IBuyerMilestoneIssueDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const [reason, setReason] = useState<TBuyerIssueReason | "">("");
  const [files, setFiles] = useState<FileList | null>(null);

  const resetForm = useCallback(() => {
    setReason("");
    setFiles(null);
  }, []);

  const { mutate: createBuyerDispute, isPending } = useCreateBuyerDispute({
    onSuccess: () => {
      resetForm();
      onOpenChange(false);
    },
  });

  const canSubmit = !!reason && !isPending;

  const handleSubmit = () => {
    if (!reason || !canSubmit) return;

    const reasonLabel =
      BUYER_ISSUE_REASONS.find((item) => item.value === reason)?.label ??
      reason;

    createBuyerDispute({
      type: "BUYER_ISSUE",
      milestoneIds: [milestoneId],
      reasonCategory: reasonLabel,
      reasonDetail: reasonLabel,
      attachmentFiles: files ?? undefined,
      requestedRefundAmount: 0,
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...dialogProps}>
      {children && (
        <DialogTrigger asChild onClick={() => onOpenChange(true)}>
          {children}
        </DialogTrigger>
      )}
      {open ? (
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-[520px] lg:max-w-[728px] sm:rounded-none">
          <DialogHeader className="space-y-0 px-6 pb-4 pt-6 text-left flex items-start gap-2 flex-row">
            <ClipboardSearch color="#000000" width={40} height={40} />
            <div>
              <DialogTitle className="text-subtitle-2 font-semibold">
                Report an issue with this milestone
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground-body">{projectName}</span>
                {": "}
                <span className="text-foreground-body">{milestoneName}</span>
              </p>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <CustomSelectField
              label={{
                children: "Issue type",
                className: "font-semibold text-base text-foreground-body",
              }}
              placeholder="Select Issue Type"
              value={reason || undefined}
              onValueChange={(value) => setReason(value as TBuyerIssueReason)}
              options={BUYER_ISSUE_REASONS.map((item) => ({
                value: item.value,
                children: item.label,
              }))}
              trigger={{ className: "rounded-none h-12" }}
            />

            <div className="grid w-full gap-1.5">
              <Label className="font-semibold text-foreground-body">
                Upload images (Optional)
              </Label>
              <MilestoneInputSectionImageUpload
                files={files}
                onFilesChange={setFiles}
              />
            </div>
          </div>

          <Separator />

          <DialogFooter className="flex-col md:flex-row justify-between gap-3 px-6 py-4 sm:justify-between sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="min-w-[334px]">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="min-w-[334px]"
              loading={isPending}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default BuyerMilestoneIssueDialog;
