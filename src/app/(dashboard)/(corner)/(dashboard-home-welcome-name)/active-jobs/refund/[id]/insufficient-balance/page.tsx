"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import InsufficientWalletBalance from "@/components/custom/dialog/RefundRequest/InsufficientWalletBalance";
import { getMockReceivingAccount } from "@/components/custom/dialog/RefundRequest/InsufficientWalletBalance/mockReceivingAccount";
import { getWalletBalanceForCurrency } from "@/components/util/wallet";
import { jsonToFormData } from "@/lib/utils";
import { UmojaLinnCurrency } from "@/types/project";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import { useSubmitRefundRepayment } from "@/tanstack/hooks/useDispute";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const InsufficientWalletBalancePage = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const disputeId = searchParams.get("disputeId") ?? "";
  const refundAmount = Number(searchParams.get("amount")) || 0;
  const currency = (searchParams.get("currency") as UmojaLinnCurrency) || "USD";

  const { data: walletResponse } = useGetWallet();

  const availableBalance = useMemo(
    () => getWalletBalanceForCurrency(walletResponse?.data?.data, currency),
    [walletResponse?.data?.data, currency],
  );

  const { mutate, isPending } = useSubmitRefundRepayment(disputeId, {
    onSuccess: () => {
      router.push(`/active-jobs/${params.id}`);
    },
  });

  const handleSubmit = (receipt: FileList) => {
    if (!disputeId || !receipt?.length) return;

    const topUpAmount = Math.max(0, refundAmount - availableBalance);

    mutate(
      jsonToFormData({
        amountPaid: topUpAmount,
        "refund-receipt": receipt[0],
      }),
    );
  };

  if (!disputeId) {
    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          className="w-fit px-0 hover:bg-transparent"
          asChild
        >
          <Link href={`/active-jobs/${params.id}`}>
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Missing dispute information. Please submit your refund request again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        className="w-fit px-0 hover:bg-transparent"
        asChild
      >
        <Link href={`/active-jobs/${params.id}`}>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Link>
      </Button>

      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md sm:p-10">
        <InsufficientWalletBalance
          refundAmount={refundAmount}
          availableBalance={availableBalance}
          currency={currency}
          receivingAccount={getMockReceivingAccount(currency)}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
};

export default InsufficientWalletBalancePage;
