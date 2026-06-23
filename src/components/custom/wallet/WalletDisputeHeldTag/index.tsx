"use client";

import React from "react";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { IWalletDisputeHeldTagProps } from "./@types";

const WalletDisputeHeldTag = ({
  currency,
  amount,
  hideBalance,
  className,
}: IWalletDisputeHeldTagProps) => {
  return (
    <div
      className={cn(
        "flex w-fit items-center justify-between gap-3 rounded-lg bg-[#FEF3F2] px-4 py-2",
        className,
      )}
    >
      <span className="rounded-md bg-white px-2 py-0.5 text-sm font-medium text-error-700">
        Held in Dispute
      </span>
      <span className="text-sm font-semibold text-error-700">
        {hideBalance
          ? "********"
          : `${getCurrencySymbol(currency)}${formatCurrencyValue(amount)}`}
      </span>
    </div>
  );
};

export default WalletDisputeHeldTag;
