"use client";
import { CustomSelectField } from "@/components/custom/Select";
import { Separator } from "@/components/ui/separator";
import WithdrawalAmountForm from "@/section/form/withdraw/WithdrawalAmount";
import { UmojaLinnCurrency } from "@/types/project";
import React, { useState } from "react";

const SettingsPaymentPage = () => {
  const [currency, setCurrency] = useState<UmojaLinnCurrency>("EURO");

  return (
    <div className="">
      <h1 className="text-subtitle-1 font-bold text-foreground mb-1">
        Payment method
      </h1>
      <p className="text-foreground-body">Update your payment details</p>
      <Separator className="bg-gray-200 my-8" />

      {/* <CustomSelectCountry
        label="Currency"
        hint="Our payment options are customized to suit your location, ensuring efortless withdrawals"
        wrapperClassName="mb-12"
        isDisabled={isPending}
        value={country}
        onChange={(val: unknown) => {
          const typedVal = val as { value: string };
          setCountry(typedVal?.value);
        }}
      /> */}
      <div className="mb-12">
        <CustomSelectField
          label="Currency"
          value={currency}
          onValueChange={(value) => setCurrency(value as UmojaLinnCurrency)}
          options={[
            {
              children: "Euro",
              value: "EURO",
            },
            {
              children: "Naira",
              value: "NAIRA",
            },
          ]}
        />
      </div>
      {currency && <WithdrawalAmountForm mode="PAYMENT" currency={currency} />}
    </div>
  );
};

export default SettingsPaymentPage;
