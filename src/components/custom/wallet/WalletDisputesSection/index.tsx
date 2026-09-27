"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import DisputeStatusBadge from "@/section/dashboard/project/disputes/DisputeStatusBadge";
import { useGetWalletDisputes } from "@/tanstack/hooks/useDispute";
import Link from "next/link";
import { uuidToBase62Safe } from "@/lib/uuid";
import { IWalletDisputesSectionProps } from "./@types";

const WalletDisputesSection = ({
  currency,
  hideBalance,
}: IWalletDisputesSectionProps) => {
  const { data: disputesResponse, isPending } = useGetWalletDisputes();

  const baseSlug = "active-jobs";

  const currencyDisputes = useMemo(
    () =>
      (disputesResponse?.data?.data ?? []).filter(
        (dispute) => dispute.currency === currency,
      ),
    [currency, disputesResponse?.data?.data],
  );

  if (isPending || !currencyDisputes.length) return null;

  return (
    <div className="rounded-lg border border-input bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-navy-900">Disputes</h3>
      <div className="flex flex-col gap-3">
        {currencyDisputes.map((dispute) => {
          const title = dispute.project?.title ?? "Active dispute";

          return (
            <Link
              key={dispute.id}
              href={dispute.project?.id ? `/${baseSlug}/${uuidToBase62Safe(dispute.project.id)}/details` : "#"}
              className="flex flex-wrap justify-between items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
            >
              <span className="  text-sm font-medium text-foreground-body">
                {title}
              </span>
              <div className="flex w-4/12 justify-between">
                <span className="text-sm font-semibold text-error-400">
                  {hideBalance
                    ? "********"
                    : `${getCurrencySymbol(currency)}${formatCurrencyValue(dispute.totalDisputed)}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(dispute.createdAt), "MMM d, yyyy")}
                </span>
                <DisputeStatusBadge status={dispute.status} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WalletDisputesSection;
