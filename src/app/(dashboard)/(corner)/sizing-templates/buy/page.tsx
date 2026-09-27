"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePurchaseSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";
import { useGetAppConfig } from "@/tanstack/hooks/useUser";
import { getCurrencySymbol } from "@/lib/string";
import type { UmojaLinnCurrency } from "@/types/project";

const PAYMENT_CURRENCIES: { value: UmojaLinnCurrency; label: string }[] = [
  { value: "EURO", label: "Euro" },
  { value: "NAIRA", label: "Naira" },
  { value: "USD", label: "US Dollar" },
  { value: "GBP", label: "British Pound" },
  { value: "CAD", label: "Canadian Dollar" },
];

const BuyTemplatesPage = () => {
  const router = useRouter();
  const { data: appConfig } = useGetAppConfig();
  const [selectedCurrency, setSelectedCurrency] =
    useState<UmojaLinnCurrency>("EURO");
  const [templateCount, setTemplateCount] = useState("1");

  const BASE_PRICE_EUR =
    appConfig?.data?.data?.defaultTemplatePriceInEuro || 5.99;

  const pricePerTemplateInEuro = BASE_PRICE_EUR;
  const parsedTemplateCount = parseInt(templateCount, 10);
  const isValidTemplateCount =
    Number.isFinite(parsedTemplateCount) && parsedTemplateCount >= 1;
  const totalAmount = (
    (isValidTemplateCount ? parsedTemplateCount : 0) * pricePerTemplateInEuro
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const { mutate: purchaseTemplate, isPending } = usePurchaseSizingTemplate({
    onSuccess: (response) => {
      const checkoutUrl = response?.data?.data?.checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
      }
    },
  });

  const handlePayNow = () => {
    if (!isValidTemplateCount) return;
    purchaseTemplate({
      currency: selectedCurrency,
      numberOfTemplates: parsedTemplateCount,
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-foreground">Buy Templates</h1>
        <p className="text-sm text-gray-500 mt-1">Buy new sizing templates</p>
      </div>

      <Separator className="bg-gray-100" />

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left Column: Payment Options */}
        <div className="w-full lg:w-[60%]">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Select currency to pay with
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-full">
              <Select
                value={selectedCurrency}
                onValueChange={(value) =>
                  setSelectedCurrency(value as UmojaLinnCurrency)
                }
              >
                <SelectTrigger className="w-full bg-white h-11 border-gray-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_CURRENCIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <span className="inline-flex w-8 justify-center font-semibold text-foreground">
                          {getCurrencySymbol(value)}
                        </span>
                        <span className="text-foreground">{label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-gray-50 py-6 px-[18px] rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6">
            <div>
              <label className="text-xs text-gray-600 block mb-2 font-medium">
                Number of Templates to Buy
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className="h-10 py-2 bg-white border-gray-200"
                value={templateCount}
                onChange={(e) => setTemplateCount(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <span className="text-gray-400 font-bold tracking-widest text-lg">
                ---
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total to Pay
              </span>
              <span className="text-sm font-bold text-foreground">
                €{totalAmount}
              </span>
            </div>

            <Button
              className="w-full bg-[#EAAA08] text-white font-semibold py-2.5 px-4 mt-2"
              onClick={handlePayNow}
              disabled={isPending || !isValidTemplateCount}
            >
              {isPending ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-100 mt-12 mb-6" />

      {/* Footer Back Button */}
      <div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-foreground-body hover:bg-gray-100 px-0 hover:px-2 transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default BuyTemplatesPage;
