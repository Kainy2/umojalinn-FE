"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { parseDisputeAmount } from "@/section/dashboard/project/disputes/utils";
import DisputeStatusBadge from "@/section/dashboard/project/disputes/DisputeStatusBadge";
import { IWalletDisputesSectionProps } from "./@types";
import { MOCK_WALLET_DISPUTES } from "./mockWalletDisputes";

const WalletDisputesSection = ({
  currency,
  hideBalance,
}: IWalletDisputesSectionProps) => {
  // TODO: replace MOCK_WALLET_DISPUTES with useGetMyDisputes() when API is ready
  const disputes = MOCK_WALLET_DISPUTES;

  const currencyDisputes = useMemo(
    () =>
      disputes.filter(
        (dispute) =>
          dispute.currency === currency && dispute.status === "IN_REVIEW",
      ),
    [currency, disputes],
  );

  if (!currencyDisputes.length) return null;

  return (
    <div className="rounded-lg border border-input bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-navy-900">Disputes</h3>
      <div className="flex flex-col gap-3">
        {currencyDisputes.map((dispute) => {
          const amount = parseDisputeAmount(
            dispute.requestedRefundAmount ?? dispute.escrowAmount,
          );
          const title =
            dispute.project?.title ??
            dispute.milestone?.title ??
            "Active dispute";

          return (
            <div
              key={dispute.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground-body">
                {title}
              </span>
              <span className="text-sm font-semibold text-navy-900">
                {hideBalance
                  ? "********"
                  : `${getCurrencySymbol(currency)}${formatCurrencyValue(amount)}`}
              </span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(dispute.createdAt), "MMM d, yyyy")}
              </span>
              <DisputeStatusBadge status={dispute.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletDisputesSection;
