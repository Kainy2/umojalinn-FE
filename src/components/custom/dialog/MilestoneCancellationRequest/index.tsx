"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CustomSelectField } from "@/components/custom/Select";
import TextAreaField from "@/components/custom/input/TextAreaField";
import MilestoneInputSectionImageUpload from "@/components/custom/picker/MilestoneInputSectionImageUpload";
import { MilestoneMultiSelect } from "@/components/custom/dialog/RefundRequest/MilestoneMultiSelect";
import { useCreateDesignerDispute } from "@/tanstack/hooks/useDispute";
import ClipboardSearch from "@/assets/ClipboardSearch";
import { DISPUTE_REASONS, TDisputeReason } from "@/types/dispute";
import {
  IMilestoneCancellationRequestDialogProps,
  TClientAwareness,
} from "./@types";

export const MilestoneCancellationRequestDialog = ({
  milestoneId: fixedMilestoneId,
  projectName,
  milestoneName: fixedMilestoneName,
  milestones,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...dialogProps
}: IMilestoneCancellationRequestDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const requiresMilestoneSelect = !!milestones?.length && !fixedMilestoneId;

  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>(
    [],
  );
  const [reason, setReason] = useState<TDisputeReason | "">("");
  const [description, setDescription] = useState("");
  const [isClientAware, setIsClientAware] = useState<TClientAwareness>("no");
  const [confirmed, setConfirmed] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const selectedMilestoneNames = useMemo(
    () =>
      milestones
        ?.filter((item) => selectedMilestoneIds.includes(item.id))
        .map((item) => item.title) ?? [],
    [milestones, selectedMilestoneIds],
  );

  const milestoneIds = fixedMilestoneId
    ? [fixedMilestoneId]
    : selectedMilestoneIds;
  const milestoneName =
    fixedMilestoneName ??
    (selectedMilestoneNames.length > 0
      ? selectedMilestoneNames.join(", ")
      : undefined);

  const resetForm = useCallback(() => {
    setSelectedMilestoneIds([]);
    setReason("");
    setDescription("");
    setIsClientAware("no");
    setConfirmed(false);
    setFiles(null);
  }, []);

  const { mutate: createDesignerDispute, isPending } = useCreateDesignerDispute(
    {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
      },
    },
  );

  const canSubmit =
    milestoneIds.length > 0 &&
    !!reason &&
    !!description.trim() &&
    !!isClientAware &&
    confirmed &&
    !isPending;

  const handleSubmit = () => {
    if (!reason || milestoneIds.length === 0 || !canSubmit) return;

    const reasonLabel =
      DISPUTE_REASONS.find((item) => item.value === reason)?.label ?? reason;

    createDesignerDispute({
      type: "DESIGNER_CANCELLATION_REQUEST",
      milestoneIds,
      reasonCategory: reasonLabel,
      reasonDetail: description.trim(),
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
                Milestone Cancellation Request
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground-body">{projectName}</span>
                {milestoneName ? (
                  <>
                    {": "}
                    <span className="text-foreground-body">
                      {milestoneName}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            {requiresMilestoneSelect && milestones && (
              <MilestoneMultiSelect
                milestones={milestones}
                value={selectedMilestoneIds}
                onChange={setSelectedMilestoneIds}
                label="Milestone(s)"
                placeholder="Select milestone(s) to cancel"
                enforceDeliveryRules
              />
            )}

            <CustomSelectField
              label={{
                children: "Cancellation reason",
                className: "font-semibold text-base text-foreground-body",
              }}
              placeholder="Select Reason"
              value={reason || undefined}
              onValueChange={(value) => setReason(value as TDisputeReason)}
              options={DISPUTE_REASONS.map((item) => ({
                value: item.value,
                children: item.label,
              }))}
              trigger={{ className: "rounded-none h-12" }}
            />

            <TextAreaField
              label={{
                children: "Description",
                className: "font-semibold text-foreground-body",
              }}
              placeholder="Enter your message..."
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] resize-none rounded-none"
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

            <div className="grid w-full gap-2">
              <Label className="font-semibold text-foreground-body">
                Is the client aware of this cancellation
              </Label>
              <RadioGroup
                value={isClientAware}
                onValueChange={(value) =>
                  setIsClientAware(value as TClientAwareness)
                }
                className="flex flex-row gap-6"
              >
                <Label
                  htmlFor="client-aware-yes"
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                >
                  <RadioGroupItem value="yes" id="client-aware-yes" />
                  Yes
                </Label>
                <Label
                  htmlFor="client-aware-no"
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                >
                  <RadioGroupItem value="no" id="client-aware-no" />
                  No
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="milestone-cancellation-confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(!!checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor="milestone-cancellation-confirm"
                className="cursor-pointer text-sm font-normal leading-snug text-foreground-body"
              >
                I understand that this will cancel the selected milestone(s) and
                related funds in escrow will be released back to the client.
              </Label>
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
              loading={isPending}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default MilestoneCancellationRequestDialog;
