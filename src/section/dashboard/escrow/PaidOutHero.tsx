"use client";
import { currencyOptions } from "@/components/custom/card/Wallet";
import CustomReactSelect from "@/components/custom/ReactSelect";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
  useGetWallet,
} from "@/tanstack/hooks/useProject";
import { UmojaLinnCurrency } from "@/types/project";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const EscrowPaidOutHero = () => {
  const pathName = usePathname();
  const { data: walletData } = useGetWallet();

  const { data: session } = useSession();

  const { data: buyerProjects } = useGetAllBuyerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: session?.user?.profileRole === "BUYER" },
  );
  const { data: designerProjects } = useGetAllDesignerProject(
    {
      projectStatus: "LIVE",
    },
    { enabled: session?.user?.profileRole === "DESIGNER" },
  );

  const projects = (
    session?.user?.profileRole === "BUYER" ? buyerProjects : designerProjects
  )?.data?.data;

  const [currency, setCurrency] = useState<UmojaLinnCurrency>("EURO");

  if (pathName?.match(/^\/escrow\/paid-out$/))
    return (
      <div className="flex items-center justify-center relative h-56  mb-8">
        <Image
          src="/img/png/pattern.png"
          alt=""
          fill
          className="object-cover object-center object-no-repeat  absolute opacity-15"
        />
        <div className="flex gap-2 flex-col items-center relative text-center  text-foreground-body p-2 bg-white shadow-white shadow-[0px_0px_5px_4px] rounded-md">
          <p>Escrow Balance</p>
          <div className="border border-input p-2 pl-4 rounded-md inline-flex justify-center items-center gap-8">
            <span className="font-semibold text-subtitle-1 ">
              {getCurrencySymbol(currency)}
              {formatCurrencyValue(
                (currency === "EURO"
                  ? walletData?.data?.data?.eurEscrowBalance
                  : walletData?.data?.data?.ngnEscrowBalance) || 0,
              )}
            </span>
            <span className="p-2 rounded-sm bg-gray-100">
              <CustomReactSelect
                adornment
                isSearchable={false}
                value={currencyOptions?.find((opt) => opt?.value === currency)}
                onChange={(newValue: unknown) => {
                  const typedValue =
                    newValue as (typeof currencyOptions)[number];
                  setCurrency(typedValue?.value);
                }}
                options={currencyOptions}
              />
            </span>
          </div>
          <div className="text-sm p-4 rounded-3xl bg-gray-50 border border-gray-200 text-foreground-body flex items-center justify-center gap-3">
            <p>
              Active projects{" "}
              <span className="font-bold">{projects?.length || 0}</span>
            </p>
            <Separator
              className="border-gray-200 shrink-0 h-4"
              orientation="vertical"
            />
            <p>
              Released{" "}
              <span className="font-bold">
                {walletData?.data?.data?.transactions?.length || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
};

export default EscrowPaidOutHero;
