"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { getWalletCurrencyLabel } from "@/components/util/wallet";
import { UmojaLinnCurrency } from "@/types/project";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { IInsufficientWalletBalanceProps } from "./@types";
import ReceivingAccountField from "./ReceivingAccountField";

const InsufficientWalletBalance = ({
  refundAmount,
  availableBalance,
  currency,
  receivingAccount,
  onSubmit,
  isPending = false,
}: IInsufficientWalletBalanceProps) => {
  const [receipt, setReceipt] = useState<FileList | null>(null);

  const currencyLabel = getWalletCurrencyLabel(
    (currency ?? "USD") as UmojaLinnCurrency,
  );
  const currencySymbol = getCurrencySymbol(currency ?? undefined);
  const topUpAmount = Math.max(0, refundAmount - availableBalance);

  const formattedRefund = `${currencySymbol}${formatCurrencyValue(refundAmount)}`;
  const formattedBalance = `${currencySymbol}${formatCurrencyValue(availableBalance)}`;
  const formattedTopUp = `${currencySymbol}${formatCurrencyValue(topUpAmount)}`;

  const handleReceiptSelect = (file: File | FileList | null) => {
    if (file instanceof FileList) {
      setReceipt(file);
      return;
    }
    if (file instanceof File) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setReceipt(dataTransfer.files);
      return;
    }
    setReceipt(null);
  };

  const canSubmit = useMemo(
    () => !!receipt?.length && !isPending,
    [receipt, isPending],
  );

  return (
    <div className="flex flex-col gap-6 max-w-[494px]">
      <div className="space-y-2 text-center">
        <h2 className="text-subtitle-2 font-semibold text-foreground">
          Insufficient Wallet Balance
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You selected a refund of {formattedRefund}. Your {currencyLabel}{" "}
          wallet balance is not enough to cover this amount. Top up your wallet
          with{" "}
          <span className="font-semibold text-error">{formattedTopUp}</span> to
          avoid a negative balance when the refund is approved.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-3 sm:gap-6 sm:text-center">
        <div>
          <p className="text-xs text-muted-foreground">Refund amount</p>
          <p className="mt-1 text-sm font-semibold text-foreground-body">
            {formattedRefund}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Available balance</p>
          <p className="mt-1 text-sm font-semibold text-foreground-body">
            {formattedBalance}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Amount to top up</p>
          <p className="mt-1 text-sm font-semibold text-error">
            {formattedTopUp}
          </p>
        </div>
      </div>
      <Separator />

      <div>
        <p className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
          {currencyLabel}-receiving account
        </p>
        <div className="px-4">
          <ReceivingAccountField
            label="Account Holder"
            value={receivingAccount.accountHolder}
          />
          <ReceivingAccountField
            label="Account Number"
            value={receivingAccount.accountNumber}
          />
          <ReceivingAccountField
            label="Routing Number"
            value={receivingAccount.routingNumber}
          />
          <ReceivingAccountField
            label="Bank Swift code"
            value={receivingAccount.bankSwiftCode}
            hint={receivingAccount.swiftNote}
          />
          <ReceivingAccountField
            label="Account Type"
            value={receivingAccount.accountType}
          />
          <ReceivingAccountField
            label="Bank Address"
            value={receivingAccount.bankAddress}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-center text-xs text-gray-600">
          Note: Kindly transfer exact amount to the account details above and
          upload your payment receipt
        </p>
        <FileUploadPicker
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          multiple={false}
          onSelect={handleReceiptSelect}
          cta="Upload"
          details={
            <>
              or drag and drop payment receipt <br /> PNG, JPG or PDF
            </>
          }
          rounded
          className="w-full"
        />
        {receipt && receipt.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {receipt[0].name} selected
          </p>
        )}

      </div>

      <Button
        type="button"
        className={cn(
          "h-12 w-full rounded-full text-base font-semibold",
          !canSubmit && "opacity-60",
        )}
        disabled={!canSubmit}
        onClick={() => receipt && onSubmit(receipt)}
      >
        {isPending ? "Submitting..." : "I've sent the money"}
      </Button>
    </div>
  );
};

export default InsufficientWalletBalance;
