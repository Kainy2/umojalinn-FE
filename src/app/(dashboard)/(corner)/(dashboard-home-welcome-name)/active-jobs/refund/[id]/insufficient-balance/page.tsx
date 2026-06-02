"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import InsufficientWalletBalance from "@/components/custom/dialog/RefundRequest/InsufficientWalletBalance";
import { getMockReceivingAccount } from "@/components/custom/dialog/RefundRequest/InsufficientWalletBalance/mockReceivingAccount";
import { useToast } from "@/hooks/use-toast";
import { UmojaLinnCurrency } from "@/types/project";
import { useParams, useRouter, useSearchParams } from "next/navigation";

/** Mock balance until wallet/refund APIs are wired */
const MOCK_AVAILABLE_BALANCE = 450;

const InsufficientWalletBalancePage = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refundAmount = Number(searchParams.get("amount")) || 0;
  const currency = (searchParams.get("currency") as UmojaLinnCurrency) || "USD";
  const availableBalance =
    Number(searchParams.get("balance")) || MOCK_AVAILABLE_BALANCE;

  const handleSubmit = (_receipt: FileList) => {
    void _receipt;
    setIsSubmitting(true);
    // TODO: POST wallet top-up receipt + refund request when API is ready
    toast({
      title: "Payment receipt received",
      description:
        "We'll verify your transfer and process your refund request.",
    });
    setIsSubmitting(false);
    router.push(`/active-jobs/${params.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" className="w-fit px-0 hover:bg-transparent" asChild>
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
          isPending={isSubmitting}
        />
      </div>
    </div>
  );
};

export default InsufficientWalletBalancePage;
