"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { IWalletDisputeBannerProps } from "./@types";

const WalletDisputeBanner = ({ className }: IWalletDisputeBannerProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-warning-50 bg-warning-25 px-4 py-3 text-sm font-medium text-warning",
        className,
      )}
    >
      Some funds are temporarily locked due to an active dispute
    </div>
  );
};

export default WalletDisputeBanner;
