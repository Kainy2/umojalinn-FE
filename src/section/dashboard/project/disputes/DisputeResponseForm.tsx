"use client";

import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TextAreaField from "@/components/custom/input/TextAreaField";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { removeNonDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  IDisputeResponseFormProps,
  TDisputeResolutionPreference,
} from "./@types";

const DisputeResponseForm = ({
  currency,
  fullRefundAmount = 0,
  onCancel,
  onSubmit,
}: IDisputeResponseFormProps) => {
  const [response, setResponse] = useState("");
  const [resolution, setResolution] =
    useState<TDisputeResolutionPreference>("FULL");
  const [partialAmount, setPartialAmount] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const formattedFullRefund = `${currencySymbol}${formatCurrencyValue(fullRefundAmount)}`;
  const isPartialDisabled = resolution !== "PARTIAL";

  const isValid = useMemo(() => {
    if (!response.trim()) return false;
    if (resolution === "PARTIAL" && !partialAmount.trim()) return false;
    return true;
  }, [response, resolution, partialAmount]);

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
        <p>
          <span className="font-semibold">Important: </span>
          Everything except your preferred resolution will be visible to the
          buyer.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" disabled={!isValid} onClick={onSubmit}>
          Submit Response
        </Button>
      </div>
    </div>
  );
};

export default DisputeResponseForm;
