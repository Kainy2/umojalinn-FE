"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TextAreaField from "@/components/custom/input/TextAreaField";
import MilestoneInputSectionImageUpload from "@/components/custom/picker/MilestoneInputSectionImageUpload";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { uuidToBase62Safe } from "@/lib/uuid";
import { removeNonDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRespondToDispute } from "@/tanstack/hooks/useDispute";
import {
  IDisputeResponseFormProps,
  TDisputeResolutionPreference,
} from "./@types";
import { mapPreferredResolutionToApi } from "./utils";

const DisputeResponseForm = ({
  disputeId,
  projectId,
  currency,
  fullRefundAmount = 0,
  onCancel,
  onSuccess,
}: IDisputeResponseFormProps) => {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [resolution, setResolution] =
    useState<TDisputeResolutionPreference>("FULL");
  const [partialAmount, setPartialAmount] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const { mutate, isPending } = useRespondToDispute(disputeId, {
    onSuccess: (data) => {
      const walletCheck = data?.data?.data?.walletCheck;

      if (walletCheck?.insufficient) {
        const projectSlug = uuidToBase62Safe(projectId);
        const params = new URLSearchParams({
          disputeId,
          amount: String(walletCheck.refundAmount),
          currency: walletCheck.currency,
        });
        router.push(
          `/active-jobs/refund/${projectSlug}/insufficient-balance?${params.toString()}`,
        );
        return;
      }

      onSuccess?.();
    },
  });

  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const formattedFullRefund = `${currencySymbol}${formatCurrencyValue(fullRefundAmount)}`;
  const isPartialDisabled = resolution !== "PARTIAL";

  const partialAmountNumber = useMemo(() => {
    const parsed = Number(removeNonDigits(partialAmount));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [partialAmount]);

  const isValid = useMemo(() => {
    if (!response.trim()) return false;
    if (resolution === "PARTIAL" && !partialAmount.trim()) return false;
    return true;
  }, [response, resolution, partialAmount]);

  const handleSubmit = () => {
    if (!isValid || isPending) return;

    mutate({
      message: response.trim(),
      preferredResolution: mapPreferredResolutionToApi(resolution),
      preferredRefundAmount:
        resolution === "PARTIAL" ? partialAmountNumber : undefined,
      attachmentFiles: files ?? undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-semibold text-foreground-body">
        Your Response
      </h4>

      <TextAreaField
        label={{
          children: "Explain your side of the situation",
          className: "font-semibold text-foreground-body",
        }}
        placeholder="Provide your perspective on this dispute..."
        rows={4}
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        className="min-h-[120px] resize-none rounded-none"
      />

      <div className="grid w-full gap-1.5">
        <Label className="font-semibold text-foreground-body">
          Upload Evidence (Optional but recommended)
        </Label>
        <MilestoneInputSectionImageUpload
          files={files}
          onFilesChange={setFiles}
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="font-semibold text-foreground-body">
            How would you like this dispute to be resolved? (Preferred
            Resolution)
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Your preferred resolution is for our review team. Refunds, if
            approved, are issued from escrow to the buyer.
          </p>
        </div>

        <RadioGroup
          value={resolution}
          onValueChange={(value) =>
            setResolution(value as TDisputeResolutionPreference)
          }
          className="flex flex-col gap-3"
        >
          <Label
            htmlFor="resolution-full"
            className="flex cursor-pointer items-center gap-2 text-sm font-normal"
          >
            <RadioGroupItem value="FULL" id="resolution-full" />
            Full Refund ({formattedFullRefund})
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label
              htmlFor="resolution-partial"
              className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-normal"
            >
              <RadioGroupItem value="PARTIAL" id="resolution-partial" />
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
                <span className="text-muted-foreground">{currencySymbol}</span>
              }
              className="h-12 rounded-none"
            />
          </div>
          <Label
            htmlFor="resolution-none"
            className="flex cursor-pointer items-center gap-2 text-sm font-normal"
          >
            <RadioGroupItem value="NONE" id="resolution-none" />
            No refund
          </Label>
        </RadioGroup>
      </div>

      <div
        className={cn(
          "flex gap-3 rounded-lg border border-primary bg-primary-50 p-4 text-sm text-foreground-body",
        )}
      >
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-[#CA8504]">
          <span className="font-semibold text-[#A15C07]">Important: </span>
          Everything except your preferred resolution will be visible to the
          buyer.
          <br />
          If a full or partial refund is approved for any incomplete
          milestone(s) involved in this dispute, that milestone(s) will be
          closed .
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!isValid || isPending}
          loading={isPending}
          onClick={handleSubmit}
        >
          Submit Response
        </Button>
      </div>
    </div>
  );
};

export default DisputeResponseForm;
