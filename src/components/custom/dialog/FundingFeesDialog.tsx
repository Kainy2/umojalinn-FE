"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrencyValue } from "@/lib/number";
import { getCollectionFeeFormula } from "@/lib/payment-fees";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency, UmojaLinnPaymentFees } from "@/types/project";
import { DialogProps } from "@radix-ui/react-dialog";
import { CircleHelp } from "lucide-react";
import React from "react";

type FundingFeesDialogProps = DialogProps & {
  fees: UmojaLinnPaymentFees | null | undefined;
  currency: UmojaLinnCurrency | null | undefined;
  onProceed: () => void;
  isPending?: boolean;
};

const formatMoney = (
  amount: number,
  currency: UmojaLinnCurrency | null | undefined,
) => `${getCurrencySymbol(currency)}${formatCurrencyValue(amount)}`;

const FundingFeesDialog = ({
  fees,
  currency,
  onProceed,
  isPending = false,
  ...props
}: FundingFeesDialogProps) => {
  const formula = getCollectionFeeFormula(currency);

  if (!fees) return null;

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex gap-2 flex-col lg:flex-row">
          <div className="icon-wrapper mb-4">
            <CircleHelp />
          </div>
          <div>
            <DialogTitle className="font-medium text-left">
              Payment fee breakdown
            </DialogTitle>
            <DialogDescription className="text-left">
              Review the fees before proceeding to checkout.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              {formatMoney(fees.amount, currency)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Collection fee (charged by our payment partner)
              </span>
              <span className="font-medium">
                {formatMoney(fees.collectionFee, currency)}
              </span>
            </div>
            {formula && (
              <p className="text-xs text-muted-foreground text-right">
                {formula}
              </p>
            )}
          </div>

          {fees.serviceFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium">
                {formatMoney(fees.serviceFee, currency)}
              </span>
            </div>
          )}

          <div className="border-t pt-3 flex items-center justify-between text-sm">
            <span className="font-semibold">Total charge</span>
            <span className="font-semibold">
              {formatMoney(fees.totalCharge, currency)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex w-full flex-col lg:flex-row gap-2">
          <Button
            className="w-full lg:w-auto"
            onClick={() => props.onOpenChange?.(false)}
            variant="outline"
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="w-full lg:w-auto"
            variant="default"
            type="button"
            loading={isPending}
            onClick={onProceed}
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FundingFeesDialog;
