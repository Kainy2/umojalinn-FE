"use client";
import CustomSelectCountry from "@/components/custom/SelectCountry";
import { Separator } from "@/components/ui/separator";
import WithdrawalAmountForm from "@/section/form/withdraw/WithdrawalAmount";
import { useGetMe } from "@/tanstack/hooks/useUser";
import React, { useEffect, useState } from "react";

const SettingsPaymentPage = () => {
  const [country, setCountry] = useState<string | null>(null);
  const { data: meData, isPending } = useGetMe();

  useEffect(() => {
    if (meData?.data?.data?.address?.country) {
      setCountry(meData?.data?.data?.address?.country);
    }
  }, [meData?.data?.data?.address]);

  return (
    <div className="">
      <h1 className="text-subtitle-1 font-bold text-foreground mb-1">
        Payment method
      </h1>
      <p className="text-foreground-body">Update your payment details</p>
      <Separator className="bg-gray-200 my-8" />

      <CustomSelectCountry
        label="Country"
        hint="Our payment options are customized to suit your location, ensuring efortless withdrawals"
        wrapperClassName="mb-12"
        isDisabled={isPending}
        value={country}
        onChange={(val: unknown) => {
          const typedVal = val as { value: string };
          setCountry(typedVal?.value);
        }}
      />
      {!isPending && (
        <WithdrawalAmountForm
          mode="PAYMENT"
          currency={country === "Nigeria" ? "NAIRA" : "EURO"}
        />
      )}
    </div>
  );
};

export default SettingsPaymentPage;
