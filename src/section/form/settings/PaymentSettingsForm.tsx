"use client";
import React, { useMemo, useState } from "react";
import { TPaymentAccountProvider, UmojaLinnCurrency } from "@/types/project";
import { CustomSelectField } from "@/components/custom/Select";
import { Separator } from "@/components/ui/separator";
import {
  useGetPaymentAccountInfo,
  useGetListNgnBanks,
  useConnectStripeAccount,
} from "@/tanstack/hooks/useProject";
import { paymentAccountHasStoredPayoutAddress } from "@/components/util/wallet";
import Bank from "@/icons/Bank";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import LinkStripeAddressDialog from "@/components/custom/dialog/LinkStripeAddressDialog";
import ConnectPaymentAccountOtpDialog from "@/components/custom/dialog/ConnectPaymentAccountOtpDialog";
import DisconnectStripeDialog from "@/components/custom/dialog/DisconnectStripeDialog/index";
import AddNairaAccountForm from "@/components/custom/wallet/AddNairaAccountForm";
import TextField from "@/components/custom/input/TextField";
import { Label } from "@/components/ui/label";
import StripeIcon from "@/assets/StripeLogo";

const PaymentSettingsForm = () => {
  const [currency, setCurrency] = useState<UmojaLinnCurrency>("EURO");
  const [stripeAddressDialogOpen, setStripeAddressDialogOpen] = useState(false);
  const [connectOtpDialogOpen, setConnectOtpDialogOpen] = useState(false);
  const [disconnectStripeDialogOpen, setDisconnectStripeDialogOpen] =
    useState(false);
  const [disconnectProvider, setDisconnectProvider] =
    useState<TPaymentAccountProvider>("STRIPE");
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
    return accounts.find((a) => !!a?.stripeAccountId) ?? null;
  }, [paymentAccountData, currency]);

  const hasActiveAccount = useMemo(() => {
    if (!paymentAccount) return false;
    if (currency === "NAIRA") {
      return !!paymentAccount.paystackRecipientCode;
    }
    return !!paymentAccount.stripePayoutsEnabled;
  }, [paymentAccount, currency]);

  const hasStartedStripeOnboarding = useMemo(() => {
    if (currency === "NAIRA") return false;
    const hasStripeAccount = !!paymentAccount?.stripeAccountId;
    if (!hasStripeAccount) return false;

    // Stripe can be "in progress" even if payoutsEnabled is false,
    // so include other status flags we already have in the response.
    const needsSetup =
      !paymentAccount?.stripeDetailsSubmitted ||
      !paymentAccount?.stripeChargesEnabled ||
      !paymentAccount?.stripePayoutsEnabled;

    return needsSetup;
  }, [
    currency,
    paymentAccount?.stripeAccountId,
    paymentAccount?.stripeDetailsSubmitted,
    paymentAccount?.stripeChargesEnabled,
    paymentAccount?.stripePayoutsEnabled,
  ]);
  const { mutate: connectStripeAccount, isPending: isConnectingStripe } =
    useConnectStripeAccount({
      onSuccess: (data) => {
        const onboardingUrl = data?.data?.data?.onboardingUrl;
        setConnectOtpDialogOpen(false);
        if (onboardingUrl) {
          window.location.href = onboardingUrl;
        }
      },
    });

  const openConnectStripeOtpDialog = () => {
    setConnectOtpDialogOpen(true);
  };

  const handleConnectStripeOtpConfirm = (otp: string) => {
    connectStripeAccount({ otp });
  };

  const getBankName = (code: string) => {
    return ngnBanksData?.data?.data?.find((b) => b.code === code)?.name || code;
  };

  const handleConnectStripeClick = () => {
    if (hasStartedStripeOnboarding) {
      const onboardingUrl = paymentAccount?.stripeOnboardingUrl;
      if (onboardingUrl) {
        window.open(onboardingUrl, "_blank");
        return;
      }
      openConnectStripeOtpDialog();
      return;
    }

    if (!paymentAccountHasStoredPayoutAddress(paymentAccount)) {
      setStripeAddressDialogOpen(true);
      return;
    }
    const onboardingUrl = paymentAccount?.stripeOnboardingUrl;
    if (onboardingUrl) {
      window.location.href = onboardingUrl;
      return;
    }
    openConnectStripeOtpDialog();
  };

  const handleOpenDisconnectDialog = (provider: TPaymentAccountProvider) => {
    setDisconnectProvider(provider);
    setDisconnectStripeDialogOpen(true);
  };

  const handleEditNairaPayoutAccount = () => {
    handleOpenDisconnectDialog("PAYSTACK");
  };

  const handleEditStripePayoutAccount = () => {
    const onboardingUrl = paymentAccount?.stripeOnboardingUrl;
    if (!onboardingUrl) return;
    window.open(onboardingUrl, "_blank", "noopener,noreferrer");
  };

  // const handleAddStripeBankAccount = () => {
  //   const onboardingUrl = paymentAccount?.stripeOnboardingUrl;
  //   if (onboardingUrl) {
  //     const trimmed = onboardingUrl.replace(/\/+$/, "");
  //     window.open(`${tri}`, "_blank");
  //     return;
  //   }

  //   handleConnectStripeClick();
  // };

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
              setConnectOtpDialogOpen(false);
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
                  ? `${getBankName(paymentAccount?.paystackBankCode || "")} • ${paymentAccount?.paystackAccountNumber || ""}`
                  : `${paymentAccount?.stripeIban || ""}  • ${paymentAccount?.stripeBankName || ""}`}
              </p>
              {currency == "NAIRA" && (
                <button
                  type="button"
                  onClick={handleEditNairaPayoutAccount}
                  className="text-primary font-bold text-sm mt-2 hover:underline text-left w-fit"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ) : currency === "NAIRA" ? (
          <div className="w-full">
            <AddNairaAccountForm />
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
            <p className="text-gray-500 text-sm text-center">
              {hasStartedStripeOnboarding
                ? "Your Stripe setup is in progress. Use Continue setup below to finish linking your account."
                : "No Stripe account linked for this currency. Use Connect Stripe below to link your account."}
            </p>
          </div>
        )}
      </div>
      {currency !== "NAIRA" &&
        hasActiveAccount &&
        paymentAccount?.stripeOnboardingUrl && (
        // <div className="flex gap-4">
        //   <button
        //     type="button"
        //     onClick={handleEditStripePayoutAccount}
        //     className="text-primary font-bold border border-primary  px-4 py-2 text-sm  text-left w-fit"
        //   >
        //     Add Bank Account
        //   </button>
        <button
          type="button"
          onClick={handleEditStripePayoutAccount}
          className="text-primary font-bold border border-primary  px-4 py-2 text-sm  text-left w-fit"
        >
          Edit Stripe Details
        </button>
        // </div>
      )}
      <p className="text-xs text-gray-500 max-w-2xl">
        Payments are processed by {currency === "NAIRA" ? "Paystack" : "Stripe"}
        . Payout fees, if any, are set by{" "}
        {currency === "NAIRA" ? "Paystack" : "Stripe"} and not by Umoja linn.
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
        onAddressSaved={openConnectStripeOtpDialog}
      />

      <ConnectPaymentAccountOtpDialog
        open={connectOtpDialogOpen}
        onOpenChange={setConnectOtpDialogOpen}
        intent="stripe"
        onConfirm={handleConnectStripeOtpConfirm}
        isConfirming={isConnectingStripe}
      />

      <DisconnectStripeDialog
        open={disconnectStripeDialogOpen}
        onOpenChange={setDisconnectStripeDialogOpen}
        provider={disconnectProvider}
      />

      <Separator className="bg-gray-100" />
      {/* <Button
        type="button"
        onClick={() => handleOpenDisconnectDialog("STRIPE")}
        className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-bold h-12 px-8 flex items-center gap-3 rounded-md"
      >
        <StripeIcon />
        Disconnect Stripe
      </Button> */}

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
                onClick={() => handleOpenDisconnectDialog("STRIPE")}
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-bold h-12 px-8 flex items-center gap-3 rounded-md"
              >
                <StripeIcon />
                Disconnect Stripe
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleConnectStripeClick}
                disabled={isConnectingStripe}
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-bold h-12 px-8 flex items-center gap-3 rounded-md"
              >
                <StripeIcon />
                {isConnectingStripe
                  ? "Connecting..."
                  : hasStartedStripeOnboarding
                    ? "Continue setup"
                    : "Connect Stripe"}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsForm;
