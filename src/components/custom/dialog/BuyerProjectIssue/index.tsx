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
import { MilestoneMultiSelect } from "@/components/custom/dialog/RefundRequest/MilestoneMultiSelect";
import ClipboardSearch from "@/assets/ClipboardSearch";
import { BUYER_ISSUE_REASONS, TBuyerIssueReason } from "@/types/dispute";
import { IBuyerProjectIssueDialogProps } from "./@types";

export const BuyerProjectIssueDialog = ({
  projectName,
  milestones,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
  ...dialogProps
}: IBuyerProjectIssueDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const [reason, setReason] = useState<TBuyerIssueReason | "">("");
  const [milestoneIds, setMilestoneIds] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const resetForm = useCallback(() => {
    setReason("");
    setMilestoneIds([]);
    setFiles(null);
  }, []);

  const canSubmit = !!reason && milestoneIds.length > 0;

  const handleSubmit = () => {
    if (!reason || !canSubmit) return;

    onSubmit({
      reason,
      milestoneIds,
      files,
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
                Project Name:{" "}
                <span className="text-foreground-body">{projectName}</span>
              </p>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <CustomSelectField
              label={{
                children: "Issue Category",
                className: "font-semibold text-base text-foreground-body",
              }}
              placeholder="Select Reason"
              value={reason || undefined}
              onValueChange={(value) => setReason(value as TBuyerIssueReason)}
              options={BUYER_ISSUE_REASONS.map((item) => ({
                value: item.value,
                children: item.label,
              }))}
              trigger={{ className: "rounded-none h-12" }}
            />

            <MilestoneMultiSelect
              milestones={milestones}
              value={milestoneIds}
              onChange={setMilestoneIds}
              placeholder="Select specific milestone(s) related to this issue"
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

          <DialogFooter className="flex-row justify-between gap-3 px-6 py-4 sm:justify-between sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="min-w-[334px]">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="min-w-[334px]"
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

export default BuyerProjectIssueDialog;
