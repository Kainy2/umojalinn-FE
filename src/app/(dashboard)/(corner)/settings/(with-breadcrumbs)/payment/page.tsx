"use client";
import { Separator } from "@/components/ui/separator";
import PaymentSettingsForm from "@/section/form/settings/PaymentSettingsForm";
import React from "react";

const SettingsPaymentPage = () => {
  return (
    <div className="">
      <h1 className="text-subtitle-1 font-bold text-foreground mb-1">
        Payment method
      </h1>
      <p className="text-foreground-body">Update your payment details</p>
      <Separator className="bg-gray-200 my-8" />

      <PaymentSettingsForm />
    </div>
  );
};

export default SettingsPaymentPage;
