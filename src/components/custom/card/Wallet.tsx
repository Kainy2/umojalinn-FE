"use client";
import { Button } from "@/components/ui/button";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency } from "@/types/project";
import { Eye, EyeOff, Upload } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import CustomReactSelect from "../ReactSelect";

type WalletCardProps = {
  value?: number;
  title?: string;
  subtitle: string;
  currency: UmojaLinnCurrency;
  noAction?: boolean;
  href?: string;
};

type EscrowCardProps = Pick<WalletCardProps, "title" | "subtitle"> & {
  value?: Record<UmojaLinnCurrency, number>;
};

const currencyOptions = [
  {
    value: "EURO",
    label: "EUR",
  },
  {
    value: "NAIRA",
    label: "NGN",
  },
] as const;

export const EscrowCard = (props: EscrowCardProps) => {
  const { value, title, subtitle } = props;
  const [currency, setCurrency] = useState<UmojaLinnCurrency>("EURO");

  return (
    <div className="p-8 border border-input">
      {!!title && <h2 className="font-semibold pb-7">{title}</h2>}
      <h3 className="mb-4">{subtitle}</h3>
      <div className="border border-input p-2 pl-4 rounded-md inline-flex justify-center items-center gap-8">
        <span className="font-semibold text-subtitle-1 ">
          {getCurrencySymbol(currency)}
          {formatCurrencyValue(value?.[currency] || 0)}
        </span>
        <span className="p-2 rounded-sm bg-gray-100">
          <CustomReactSelect
            adornment
            isSearchable={false}
            value={currencyOptions?.find((opt) => opt?.value === currency)}
            onChange={(newValue: unknown) => {
              const typedValue = newValue as (typeof currencyOptions)[number];
              setCurrency(typedValue?.value);
            }}
            options={currencyOptions}
          />
        </span>
      </div>
    </div>
  );
};

const WalletCard = (props: WalletCardProps) => {
  const { value, title, subtitle, currency, noAction, href } = props;
  const [obfuscate, setObfuscate] = useState(!noAction);
  return (
    <div className="p-8 border border-input">
      {!!title && <h2 className="font-semibold mb-7">{title}</h2>}
      <h3 className="mb-4">{subtitle}</h3>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-subtitle-1 ">
          {obfuscate
            ? "***************"
            : `${getCurrencySymbol(currency)}${formatCurrencyValue(value)}`}
        </h4>
        {!noAction && href && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setObfuscate((prev) => !prev)}
              className="size-11 flex items-center justify-center rounded-full bg-primary-50 text-primary [&>svg]:size-5 shrink-0 aspect-square"
            >
              {obfuscate ? <Eye /> : <EyeOff />}
            </button>
            <Button asChild>
              <Link href={href}>
                Withdraw <Upload className="size-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
