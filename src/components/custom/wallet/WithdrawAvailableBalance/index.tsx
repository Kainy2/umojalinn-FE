"use client";

import {
  getCurrencyFromWithdrawPathSegment,
  getWalletBalanceForCurrency,
} from "@/components/util/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const WithdrawAvailableBalance = () => {
  const pathname = usePathname();
  const { data: walletData, isPending: isWalletPending } = useGetWallet();

  const currency = useMemo(() => {
    const segment = pathname.split("/").filter(Boolean).pop() ?? "";
    return getCurrencyFromWithdrawPathSegment(segment);
  }, [pathname]);

  const wallet = walletData?.data?.data;
  const isLoadingBalance = isWalletPending && !wallet;

  if (!currency) {
    return null;
  }

  const availableBalance = getWalletBalanceForCurrency(wallet, currency);
  const formattedAvailableBalance = `${getCurrencySymbol(currency)}${formatCurrencyValue(availableBalance)}`;

  return (
    <p className="text-foreground-body">
      <span className="font-medium">Available balance:</span>{" "}
      {isLoadingBalance ? (
        <Skeleton className="inline-block h-4 w-24 align-middle" />
      ) : (
        formattedAvailableBalance
      )}
    </p>
  );
};

export default WithdrawAvailableBalance;
