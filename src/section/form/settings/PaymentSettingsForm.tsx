"use client";
import React, { useMemo, useState } from "react";
import { UmojaLinnCurrency } from "@/types/project";
import { CustomSelectField } from "@/components/custom/Select";
import { Separator } from "@/components/ui/separator";
import {
  useGetPaymentAccountInfo,
  useGetListNgnBanks,
} from "@/tanstack/hooks/useProject";
import { paymentAccountHasStoredPayoutAddress } from "@/components/util/wallet";
import Bank from "@/icons/Bank";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import LinkStripeAddressDialog from "@/components/custom/dialog/LinkStripeAddressDialog";
import DisconnectStripeDialog from "@/components/custom/dialog/DisconnectStripeDialog/index";
import TextField from "@/components/custom/input/TextField";
import { Label } from "@/components/ui/label";

const PaymentSettingsForm = () => {
  const [currency, setCurrency] = useState<UmojaLinnCurrency>("EURO");
  const [stripeAddressDialogOpen, setStripeAddressDialogOpen] = useState(false);
  const [disconnectStripeDialogOpen, setDisconnectStripeDialogOpen] =
    useState(false);
  const router = useRouter();

  const {
    data: paymentAccountData,
    isPending: isLoadingAccount,
    isFetching,
  } = useGetPaymentAccountInfo();
  const { data: ngnBanksData } = useGetListNgnBanks({
    enabled: currency === "NAIRA",
  });

  const paymentAccount = useMemo(() => {
    const accounts = paymentAccountData?.data?.data ?? [];

    if (currency === "NAIRA") {
      return accounts.find((a) => !!a.paystackRecipientCode) ?? null;
    }
    return accounts.find((a) => !!a.stripeAccountId) ?? null;
  }, [paymentAccountData, currency]);

  const hasActiveAccount = useMemo(() => {
    if (!paymentAccount) return false;
    if (currency === "NAIRA") {
      return !!paymentAccount.paystackRecipientCode;
    }
    return !!paymentAccount.stripePayoutsEnabled;
  }, [paymentAccount, currency]);

  const getBankName = (code: string) => {
    return ngnBanksData?.data?.data?.find((b) => b.code === code)?.name || code;
  };

  const handleConnectStripeClick = () => {
    if (!paymentAccountHasStoredPayoutAddress(paymentAccount)) {
      setStripeAddressDialogOpen(true);
      return;
    }
    const url = paymentAccount?.stripeOnboardingUrl;
    if (url) {
      window.location.href = url;
      return;
    }
  };

  const StripeIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.15396 4.77606C1.5 6.05953 1.5 7.73969 1.5 11.1V12.9C1.5 16.2603 1.5 17.9405 2.15396 19.2239C2.7292 20.3529 3.64708 21.2708 4.77606 21.846C6.05953 22.5 7.73969 22.5 11.1 22.5H12.9C16.2603 22.5 17.9405 22.5 19.2239 21.846C20.3529 21.2708 21.2708 20.3529 21.846 19.2239C22.5 17.9405 22.5 16.2603 22.5 12.9V11.1C22.5 7.73969 22.5 6.05953 21.846 4.77606C21.2708 3.64708 20.3529 2.7292 19.2239 2.15396C17.9405 1.5 16.2603 1.5 12.9 1.5H11.1C7.73969 1.5 6.05953 1.5 4.77606 2.15396C3.64708 2.7292 2.7292 3.64708 2.15396 4.77606Z"
        fill="url(#paint0_linear_stripe)"
      />
      <path
        d="M1.69892 6.20928C1.5 7.33974 1.5 8.83971 1.5 11.0996V12.8996C1.5 16.2599 1.5 17.9401 2.15396 19.2235C2.7292 20.3525 3.64708 21.2704 4.77606 21.8456C6.05953 22.4996 7.73969 22.4996 11.1 22.4996H12.9C16.2603 22.4996 17.9405 22.4996 19.2239 21.8456C20.3529 21.2704 21.2708 20.3525 21.846 19.2235C22.5 17.9401 22.5 16.2599 22.5 12.8996V11.0996C22.5 7.73929 22.5 6.05913 21.846 4.77566C21.2908 3.68597 20.4164 2.79293 19.341 2.21484L1.69892 6.20928Z"
        fill="url(#paint1_linear_stripe)"
      />
      <path
        d="M22.2827 17.8906C22.1863 18.3974 22.0471 18.8295 21.846 19.224C21.2708 20.353 20.3529 21.2709 19.224 21.8461C17.9789 22.4805 16.3605 22.4995 13.1972 22.5001H12.0439V20.1277L22.2827 17.8906Z"
        fill="url(#paint2_linear_stripe)"
      />
      <path
        d="M12.9 1.5H11.1C10.4462 1.5 9.85608 1.5 9.32007 1.50482V4.47789L19.339 2.21419C19.3009 2.19372 19.2625 2.17364 19.2239 2.15396C18.5114 1.79091 17.6766 1.62941 16.5 1.55757C15.5571 1.5 14.3948 1.5 12.9 1.5Z"
        fill="url(#paint3_linear_stripe)"
      />
      <path
        d="M22.5 13.0292C22.4999 15.2834 22.4959 16.7693 22.2827 17.8897L18.7217 18.6678V13.3611L22.5 12.4824V13.0292Z"
        fill="url(#paint4_linear_stripe)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.2057 10.0329C11.2057 9.55093 11.5998 9.36554 12.2525 9.36554C13.1884 9.36554 14.3707 9.6498 15.3066 10.1565V7.25212C14.2845 6.84426 13.2746 6.68359 12.2525 6.68359C9.7525 6.68359 8.08997 7.99367 8.08997 10.1812C8.08997 13.5924 12.7697 13.0486 12.7697 14.5193C12.7697 15.0878 12.2771 15.2732 11.5875 15.2732C10.5653 15.2732 9.2599 14.853 8.22543 14.2845V17.226C9.37074 17.7203 10.5284 17.9305 11.5875 17.9305C14.149 17.9305 15.91 16.6575 15.91 14.4452C15.8977 10.7621 11.2057 11.4172 11.2057 10.0329Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_stripe"
          x1="1.5"
          y1="1.5"
          x2="8.39749"
          y2="6.37657"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#392993" />
          <stop offset="1" stop-color="#4B47B9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_stripe"
          x1="2.2908"
          y1="6.43045"
          x2="17.5175"
          y2="18.9903"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#594BB9" />
          <stop offset="1" stop-color="#60A8F2" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_stripe"
          x1="12.0439"
          y1="20.2156"
          x2="22.5"
          y2="22.5001"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#61A2EF" />
          <stop offset="1" stop-color="#58E6FD" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_stripe"
          x1="9.32007"
          y1="2.99372"
          x2="22.5"
          y2="1.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#534EBE" />
          <stop offset="1" stop-color="#6875E2" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_stripe"
          x1="18.7217"
          y1="13.405"
          x2="22.5"
          y2="17.9301"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#71A5F3" />
          <stop offset="1" stop-color="#6CC3FA" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="flex flex-col gap-10 max-w-7xl">
      {/* Currency Selection */}
      <div className="flex flex-col gap-2">
        <CustomSelectField
          label="Currency"
          value={currency}
          onValueChange={(value) => {
            const next = value as UmojaLinnCurrency;
            setCurrency(next);
            if (next === "NAIRA") {
              setStripeAddressDialogOpen(false);
              setDisconnectStripeDialogOpen(false);
            }
          }}
          options={[
            { children: "Euro", value: "EURO" },
            { children: "Naira", value: "NAIRA" },
            { children: "Dollar", value: "USD" },
            { children: "Pound", value: "GBP" },
            { children: "Canadian Dollar", value: "CAD" },
          ]}
        />
        <p className="text-sm text-gray-500">
          Our payment options are customized to suit your preferred currency,
          ensuring effortless withdrawals.
        </p>
      </div>

      <Separator className="bg-gray-100" />

      {/* Withdrawal Details */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            Withdrawal Details
          </h3>
          <p className="text-sm text-gray-600">
            Payouts will be sent to the below account
          </p>
        </div>

        {isLoadingAccount || isFetching ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : hasActiveAccount ? (
          <div className="border border-gray-200 p-5 flex items-start gap-5 max-w-xl">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Bank className="size-6 text-gray-600" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <p className="font-bold text-gray-900">
                {currency === "NAIRA"
                  ? paymentAccount?.paystackAccountName
                  : "Stripe Account"}
              </p>
              <p className="text-sm text-gray-600">
                {currency === "NAIRA"
                  ? `${getBankName(paymentAccount?.paystackBankCode || "")} • ${paymentAccount?.paystackAccountNumber}`
                  : paymentAccount?.stripeIban || "Connected"}
              </p>
              {currency === "NAIRA" ? (
                <button
                  type="button"
                  onClick={() => {
                    // Logic to edit NGN account could go here
                  }}
                  className="text-primary font-bold text-sm mt-2 hover:underline text-left w-fit"
                >
                  Edit
                </button>
              ) : (
                <p className="text-sm text-gray-500 mt-3 max-w-md">
                  Payout address cannot be changed here while Stripe is
                  connected. Use Disconnect Stripe below if you need to update
                  it, then connect again.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
            <p className="text-gray-500 text-sm text-center">
              {currency === "NAIRA"
                ? "No payout account connected for this currency."
                : "No Stripe account linked for this currency. Use Connect Stripe below to link your account."}
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 max-w-2xl">
        Payments are processed by Stripe. Payout fees, if any, are set by Stripe
        and not by Umoja linn.
      </p>

      {currency !== "NAIRA" && paymentAccount?.address && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              Stripe Address
            </h3>
            <p className="text-sm text-gray-500">
              The Address of bank account your Stripe payouts will be sent to
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center gap-4">
              <Label className="text-gray-900">Country</Label>
              <TextField
                value={paymentAccount.address.country?.toWellFormed() || ""}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center gap-4">
              <Label className="text-gray-900">State / Province</Label>
              <TextField
                value={paymentAccount.address.state || ""}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center gap-4">
              <Label className="text-gray-900">City</Label>
              <TextField
                value={paymentAccount.address.city || ""}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center gap-4">
              <Label className="text-gray-900">Zip code/ Postal code</Label>
              <TextField
                value={paymentAccount.address.zipCode || ""}
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center gap-4">
              <Label className="text-gray-900">Address</Label>
              <TextField
                value={paymentAccount.address.address || ""}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      <LinkStripeAddressDialog
        open={stripeAddressDialogOpen}
        onOpenChange={setStripeAddressDialogOpen}
      />

      <DisconnectStripeDialog
        open={disconnectStripeDialogOpen}
        onOpenChange={setDisconnectStripeDialogOpen}
      />

      <Separator className="bg-gray-100" />

      {/* Footer Info */}
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 font-bold hover:text-gray-900"
          >
            Back
          </button>

          {currency !== "NAIRA" &&
            (hasActiveAccount ? (
              <Button
                type="button"
                onClick={() => setDisconnectStripeDialogOpen(true)}
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-bold h-12 px-8 flex items-center gap-3 rounded-md"
              >
                <StripeIcon />
                Disconnect Stripe
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleConnectStripeClick}
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-bold h-12 px-8 flex items-center gap-3 rounded-md"
              >
                <StripeIcon />
                Connect Stripe
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsForm;
