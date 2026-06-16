"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { CustomSelectField } from "@/components/custom/Select";
import TextAreaField from "@/components/custom/input/TextAreaField";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { RefundRequestConfirmDialog } from "@/components/custom/dialog/RefundRequestConfirm";
import { MilestoneMultiSelect } from "./MilestoneMultiSelect";
import { getWalletBalanceForCurrency } from "@/components/util/wallet";
import { removeNonDigits } from "@/lib/utils";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { uuidToBase62Safe } from "@/lib/uuid";
import { getWalletCurrencyLabel } from "@/components/util/wallet";
import { UmojaLinnCurrency } from "@/types/project";
import { DISPUTE_REASONS, TDisputeReason } from "@/types/dispute";
import {
  useCreateDesignerDispute,
  useGetWalletDisputeSummary,
} from "@/tanstack/hooks/useDispute";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import { IRefundRequestDialogProps, TRefundType } from "./@types";
import ClipboardSearch from "@/assets/ClipboardSearch";

const DEFAULT_CURRENCY: UmojaLinnCurrency = "USD";

export const RefundRequestDialog = ({
  projectId,
  projectName,
  milestones,
  fullRefundAmount,
  currency,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...dialogProps
}: IRefundRequestDialogProps) => {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const [milestoneIds, setMilestoneIds] = useState<string[]>([]);
  const [refundType, setRefundType] = useState<TRefundType>("PARTIAL");
  const [partialAmount, setPartialAmount] = useState("");
  const [reason, setReason] = useState<TDisputeReason | "">("");
  const [description, setDescription] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [files, setFiles] = useState<FileList | null>(null);

  const resolvedCurrency = (currency ?? DEFAULT_CURRENCY) as UmojaLinnCurrency;

  const { data: walletResponse } = useGetWallet({
    enabled: open || confirmOpen,
  });
  const { data: summaryResponse } = useGetWalletDisputeSummary({
    enabled: open || confirmOpen,
  });

  const { mutateAsync, isPending } = useCreateDesignerDispute();

  const resetForm = useCallback(() => {
    setMilestoneIds([]);
    setRefundType("PARTIAL");
    setPartialAmount("");
    setReason("");
    setDescription("");
    setConfirmed(true);
    setFiles(null);
  }, []);

  const currencySymbol = getCurrencySymbol(currency);
  const formattedFullRefund = `${currencySymbol}${formatCurrencyValue(fullRefundAmount)}`;
  const walletCurrencyLabel = getWalletCurrencyLabel(resolvedCurrency);
  const isPartialDisabled = refundType !== "PARTIAL";

  const availableBalance = useMemo(
    () =>
      getWalletBalanceForCurrency(walletResponse?.data?.data, resolvedCurrency),
    [walletResponse?.data?.data, resolvedCurrency],
  );

  const walletSummaryInsufficient =
    summaryResponse?.data?.data?.[resolvedCurrency]?.insufficientAmount ?? 0;

  const partialAmountNumber = useMemo(() => {
    const parsed = Number(removeNonDigits(partialAmount));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [partialAmount]);

  const isFormValid = useMemo(() => {
    if (!milestoneIds.length || !reason || !description.trim()) {
      return false;
    }
    if (!confirmed) return false;
    if (refundType === "PARTIAL") {
      return partialAmountNumber > 0 && partialAmountNumber <= fullRefundAmount;
    }
    return true;
  }, [
    confirmed,
    description,
    fullRefundAmount,
    milestoneIds.length,
    partialAmountNumber,
    reason,
    refundType,
  ]);

  const handleImagesSelect = (file: File | FileList | null) => {
    if (file instanceof FileList) {
      setFiles(file);
      return;
    }
    if (file instanceof File) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setFiles(dataTransfer.files);
      return;
    }
    setFiles(null);
  };

  const handleOpenFormChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      setConfirmOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const handleOpenConfirm = () => {
    if (!isFormValid) return;
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!reason || !isFormValid || isPending) return;

    const amount =
      refundType === "FULL" ? fullRefundAmount : partialAmountNumber;
    const reasonLabel =
      DISPUTE_REASONS.find((item) => item.value === reason)?.label ?? reason;
    const needsTopUp =
      amount > availableBalance || walletSummaryInsufficient > 0;

    try {
      const response = await mutateAsync({
        type: "DESIGNER_REFUND",
        milestoneIds,
        reasonCategory: reasonLabel,
        reasonDetail: description.trim(),
        requestedRefundAmount: amount,
        attachments: [],
      });
      const disputeId = response?.data?.data?.id ?? "";

      setConfirmOpen(false);
      resetForm();
      onOpenChange(false);

      if (needsTopUp && disputeId) {
        const projectSlug = uuidToBase62Safe(projectId);
        const params = new URLSearchParams({
          disputeId,
          amount: String(amount),
          currency: resolvedCurrency,
        });
        router.push(
          `/active-jobs/refund/${projectSlug}/insufficient-balance?${params.toString()}`,
        );
      }
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenFormChange} {...dialogProps}>
        {children && (
          <DialogTrigger asChild onClick={() => onOpenChange(true)}>
            {children}
          </DialogTrigger>
        )}
        {open ? (
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px] lg:max-w-[728px] sm:rounded-none">
          <DialogHeader className="space-y-0 px-6 pb-4 pt-6 text-left flex items-start gap-2 flex-row">
            <ClipboardSearch color="#000000" width={40} height={40} />
            <div>
              <DialogTitle className="text-subtitle-2 font-semibold">
                Refund Request
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Project Name:{" "}
                <span className="text-foreground-body">{projectName}</span>
              </p>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <MilestoneMultiSelect
              milestones={milestones}
              value={milestoneIds}
              onChange={setMilestoneIds}
            />

            <div className="grid w-full gap-2">
              <Label className="font-semibold text-foreground-body">
                Select Refund Type
              </Label>
              <p className="text-sm text-muted-foreground">
                You will only be charged your earnings. This refund amount
                includes Umoja linn&apos;s commission, which will also be
                returned to the client and is NOT deducted from your wallet.
              </p>
              <RadioGroup
                value={refundType}
                onValueChange={(value) =>
                  setRefundType(value as TRefundType)
                }
                className="gap-3"
              >
                <Label
                  htmlFor="refund-type-full"
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                >
                  <RadioGroupItem value="FULL" id="refund-type-full" />
                  Full Refund ({formattedFullRefund})
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Label
                    htmlFor="refund-type-partial"
                    className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-normal"
                  >
                    <RadioGroupItem
                      value="PARTIAL"
                      id="refund-type-partial"
                    />
                    Partial Refund
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={partialAmount}
                    disabled={isPartialDisabled}
                    onChange={(event) =>
                      setPartialAmount(removeNonDigits(event.target.value))
                    }
                    startAdornment={
                      <span className="text-muted-foreground">
                        {currencySymbol}
                      </span>
                    }
                    className="h-12 rounded-none"
                  />
                </div>
              </RadioGroup>
            </div>

            <CustomSelectField
              label={{
                children: "Refund Reason",
                className: "font-semibold text-foreground-body",
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
              placeholder="Explain the detailed reason for issuing this refund..."
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] resize-none rounded-none"
            />

            <div className="grid w-full gap-1.5">
              <Label className="font-semibold text-foreground-body">
                Upload images (Optional)
              </Label>
              <FileUploadPicker
                accept="image/*"
                multiple
                onSelect={handleImagesSelect}
                cta="Click to upload"
                details={
                  <>
                    or drag and drop <br /> Pictures (max. 50mb)
                  </>
                }
              />
              {files && files.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="refund-request-confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(!!checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor="refund-request-confirm"
                className="cursor-pointer text-sm font-normal leading-snug text-foreground-body"
              >
                I understand this refund will be deducted from my{" "}
                {walletCurrencyLabel} wallet balance
              </Label>
            </div>
          </div>

          <Separator />

          <DialogFooter className="flex-row justify-between gap-3 px-6 py-4 sm:justify-between sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-w-[334px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="min-w-[334px]"
              disabled={!isFormValid}
              onClick={handleOpenConfirm}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
        ) : null}
      </Dialog>

      {confirmOpen ? (
      <RefundRequestConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmSubmit}
        isPending={isPending}
      />
      ) : null}
    </>
  );
};

export default RefundRequestDialog;
