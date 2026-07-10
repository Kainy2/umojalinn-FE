"use client";
import { Button } from "@/components/ui/button";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { IWalletDisputeCurrencySummary } from "@/types/dispute";
import { UmojaLinnCurrency, UmojalinnWallet } from "@/types/project";
import { getAvailableWalletBalanceForCurrency } from "@/components/util/wallet";
import WalletDisputeHeldTag from "@/components/custom/wallet/WalletDisputeHeldTag";
import {
  Eye,
  EyeOff,
  Upload,
  Lock as LockIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import CustomReactSelect from "../ReactSelect";
import NG from "../../../../public/img/svg/NG.svg";
import EUR from "../../../../public/img/svg/EUR.svg";
import USD from "../../../../public/img/svg/USD.svg";
import GBP from "../../../../public/img/svg/GBP.svg";
import CAD from "../../../../public/img/svg/CAD.svg";
import Image from "next/image";

interface IWalletCardProps {
  wallet?: UmojalinnWallet;
  noAction?: boolean;
  stripeStatus?: string;
  paystackStatus?: string;
  onLinkStripe?: () => void;
  isLinkingStripe?: boolean;
  hideBalance?: boolean;
  onToggleBalance?: () => void;
  currency?: UmojaLinnCurrency;
  onCurrencyChange?: (currency: UmojaLinnCurrency) => void;
  currencyDisputeSummary?: IWalletDisputeCurrencySummary;
}

export const currencyOptions = [
  {
    value: "NAIRA",
    label: "NGN",
    name: "Naira",
    flag: NG.src,
    fullName: "Nigeria Naira",
  },
  {
    value: "EURO",
    label: "EUR",
    name: "Euro",
    flag: EUR.src,
    fullName: "European Euro",
  },
  {
    value: "USD",
    label: "USD",
    name: "USD",
    flag: USD.src,
    fullName: "United States Dollar",
  },
  {
    value: "GBP",
    label: "GBP",
    name: "GBP",
    flag: GBP.src,
    fullName: "British Pound",
  },
  {
    value: "CAD",
    label: "CAD",
    name: "CAD",
    flag: CAD.src,
    fullName: "Canadian Dollar",
  },
] as const;

const WalletCard = (props: IWalletCardProps) => {
  const {
    wallet,
    noAction,
    stripeStatus,
    paystackStatus,
    onLinkStripe,
    isLinkingStripe,
    hideBalance,
    onToggleBalance,
    currency = "NAIRA",
    onCurrencyChange,
    currencyDisputeSummary,
  } = props;

  const currentOption = currencyOptions.find((opt) => opt.value === currency);

  const lockedAmount = currencyDisputeSummary?.locked ?? 0;
  const availableBalance = getAvailableWalletBalanceForCurrency(
    wallet,
    currency,
    lockedAmount,
  );

  const getStripeLinkLabel = (): string => {
    switch (stripeStatus) {
      case "NOT_CONNECTED":
        return "Link Account";
      case "ONBOARDING_STARTED":
        return "Complete setup";
      case "ACTION_REQUIRED":
        return "Action required";
      case "BANK_DETAILS_MISSING":
        return "Add Account";
      case "RESTRICTED":
        return "Link Account";
      default:
        return "Link Account";
    }
  };

  const showLinkAccount = currency !== "NAIRA" && stripeStatus !== "ENABLED";
  const showAddAccount = currency === "NAIRA" && paystackStatus !== "ENABLED";
  const isWithdrawalRestricted = currencyDisputeSummary?.restricted ?? false;
  const insufficientDisputeAmount =
    currencyDisputeSummary?.insufficientAmount ?? 0;

  return (
    <div
      id="tour-wallet-balance"
      className={`border border-input rounded-lg w-full bg-white relative overflow-hidden ${currencyDisputeSummary?.restricted ? "border-b border-[#FDE272]" : ""}`}
    >
      <div className="px-2 py-4 lg:p-8">
        <div className="flex justify-between items-start lg:mb-6">
          <div id="tour-wallet-currency-select" className="flex items-center gap-2">
            <h2 className="text-gray-600 text-sm">
              Available {currentOption?.name} Balance
            </h2>
            <CustomReactSelect
              adornment={false}
              isSearchable={false}
              className="w-fit min-w-[80px]"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 50 }),
              }}
              classNames={{
                control: () =>
                  "!bg-gray-100 !border-none !rounded-2xl !min-h-[32px] !h-[32px]",
                valueContainer: () => "!p-0 !px-3",
                singleValue: () => "!text-sm !font-semibold !text-navy-900",
                indicatorSeparator: () => "!hidden",
                dropdownIndicator: () => "!p-0 !pr-2 !text-navy-900",
              }}
              value={currentOption}
              onChange={(newValue: unknown) => {
                const typedValue = newValue as (typeof currencyOptions)[number];
                if (onCurrencyChange && typedValue?.value) {
                  onCurrencyChange(typedValue.value);
                }
                // setCurrency(typedValue?.value);
              }}
              options={currencyOptions}
            />
          </div>
          {!noAction && (
            <div id="tour-wallet-link-account" className="hidden lg:flex">
              {showLinkAccount ? (
                <Button
                  variant="outline"
                  className="text-error border-error hover:bg-error/5 hover:text-error gap-2 rounded-md"
                  onClick={onLinkStripe}
                  disabled={isLinkingStripe}
                >
                  {isLinkingStripe ? "Connecting..." : getStripeLinkLabel()}
                </Button>
              ) : showAddAccount ? (
                <Button
                  asChild
                  variant="outline"
                  className="text-error border-error hover:bg-error/5 hover:text-error gap-2 rounded-md"
                >
                  <Link
                    href={`/wallet/withdraw/${currentOption?.name.toLowerCase()}`}
                  >
                    Add Account <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : isWithdrawalRestricted ? (
                <Button
                  variant="outline"
                  className="text-error border-error hover:bg-error/5 hover:text-error gap-2 rounded-md"
                  disabled
                >
                  Withdrawals restricted
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-[#E6AB00] text-white gap-2 rounded-md"
                >
                  <Link
                    href={`/wallet/withdraw/${currentOption?.name.toLowerCase()}`}
                  >
                    Withdraw <Upload className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center lg:justify-normal justify-between gap-4 lg:mb-4">
          <h3 className="text-[24px] font-semibold lg:text-4xl lg:font-bold text-navy-900">
            {hideBalance
              ? "***************"
              : `${getCurrencySymbol(currency)}${formatCurrencyValue(availableBalance)}`}
          </h3>
          <button
            onClick={onToggleBalance}
            className="size-10 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
          >
            {hideBalance ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </button>
        </div>

        {lockedAmount > 0 && (
          <WalletDisputeHeldTag
            currency={currency}
            amount={lockedAmount}
            hideBalance={hideBalance}
          />
        )}

        {insufficientDisputeAmount > 0 && (
          <div className="mt-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-error-700">
            You owe{" "}
            {hideBalance
              ? "********"
              : `${getCurrencySymbol(currency)}${formatCurrencyValue(insufficientDisputeAmount)}`}{" "}
            to clear your balance. Withdrawals are restricted until this is
            resolved.
          </div>
        )}

        {!noAction && (
          <div className="lg:hidden w-full mt-4">
            {showLinkAccount ? (
              <Button
                variant="outline"
                className="text-error border-error hover:bg-error/5 hover:text-error gap-2 w-full"
                onClick={onLinkStripe}
                disabled={isLinkingStripe}
              >
                {isLinkingStripe ? "Connecting..." : getStripeLinkLabel()}
              </Button>
            ) : showAddAccount ? (
              <Button
                asChild
                variant="outline"
                className="text-error border-error hover:bg-error/5 hover:text-error gap-2 w-full"
              >
                <Link
                  href={`/wallet/withdraw/${currentOption?.name.toLowerCase()}`}
                >
                  Add Account <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : isWithdrawalRestricted ? (
              <Button
                variant="outline"
                className="text-error border-error hover:bg-error/5 hover:text-error gap-2 w-full"
                disabled
              >
                Withdrawals restricted
              </Button>
            ) : (
              <Button
                asChild
                className="bg-[#E6AB00] text-white gap-2 w-full"
              >
                <Link
                  href={`/wallet/withdraw/${currentOption?.name.toLowerCase()}`}
                >
                  Withdraw <Upload className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {lockedAmount > 0 && (
        <div className="border-t border-[#FDE272] bg-warning-25 px-4 py-3 text-sm font-medium text-[#A15C07]">
          Some funds are temporarily locked due to an active dispute
        </div>
      )}
    </div>
  );
};

export const EscrowCard = ({ wallet }: { wallet: UmojalinnWallet }) => {
  return (
    <div className="p-6 border border-input rounded-lg w-full  bg-white">
      <h3 className="text-gray-600 mb-6">Money In Escrow</h3>

      <div className="flex flex-col gap-4 mb-8">
        <div className="text-[18px] font-bold text-navy-900">
          {getCurrencySymbol("NAIRA")}
          {formatCurrencyValue(wallet?.ngnEscrowBalance || 0)}
        </div>
        <div className="text-[18px] font-bold text-navy-900">
          {getCurrencySymbol("GBP")}
          {formatCurrencyValue(wallet?.gbpEscrowBalance || 0)}
        </div>
        <div className="text-[18px] font-bold text-navy-900">
          {getCurrencySymbol("EURO")}
          {formatCurrencyValue(wallet?.eurEscrowBalance || 0)}
        </div>
        <div className="text-[18px] font-bold text-navy-900">
          {getCurrencySymbol("USD")}
          {formatCurrencyValue(wallet?.usdEscrowBalance || 0)}
        </div>
        <div className="text-[18px] font-bold text-navy-900">
          {getCurrencySymbol("CAD")}
          {formatCurrencyValue(wallet?.cadEscrowBalance || 0)}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
        <LockIcon className="size-4 shrink-0" />
        <span>
          Escrow funds are disbursed upon the approval of specific milestones.
        </span>
      </div>
    </div>
  );
};

export default WalletCard;

export const CurrencyCard = ({
  currency,
  amount,
  hideBalance,
  isSelected,
  stripeStatusLabel,
  disputeHeldAmount = 0,
  onClick,
}: {
  currency: UmojaLinnCurrency;
  amount: number;
  hideBalance?: boolean;
  isSelected?: boolean;
  stripeStatusLabel?: string | null;
  disputeHeldAmount?: number;
  onClick?: () => void;
}) => {
  const option = currencyOptions.find((opt) => opt.value === currency);
  const hasDisputeFunds = disputeHeldAmount > 0;

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg w-[249px] bg-white flex flex-col shadow-sm shrink-0 transition-all overflow-hidden ${
        isSelected
          ? "border border-[#FEEE95] ring-2 ring-[#FEEE95]/50"
          : "border-input hover:border-[#FEEE95]/60"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-2xl overflow-hidden relative">
            <Image src={option?.flag || ""} alt="" width={100} height={100} />
          </div>
          {stripeStatusLabel && (
            <span className="bg-[#FEF3F2] text-error-700 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap">
              {stripeStatusLabel}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-600 font-medium text-base">
            {hasDisputeFunds
              ? `Available ${option?.fullName}`
              : option?.fullName}
          </span>
          <h3 className="text-3xl font-bold text-navy-900">
            {hideBalance ? (
              "********"
            ) : (
              <>
                {getCurrencySymbol(currency)}
                {formatCurrencyValue(amount)}
              </>
            )}
          </h3>
        </div>
      </div>

      {hasDisputeFunds && (
        <div className="px-1 pb-6">
          <WalletDisputeHeldTag
            currency={currency}
            amount={disputeHeldAmount}
            hideBalance={hideBalance}
          />
        </div>
      )}
    </div>
  );
};
