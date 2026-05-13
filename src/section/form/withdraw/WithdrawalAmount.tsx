"use client";
import AddNairaAccountForm from "@/components/custom/wallet/AddNairaAccountForm";
import TextField from "@/components/custom/input/TextField";
import Bank from "@/icons/Bank";
import NairaSign from "@/icons/NairaSign";
import GbpSign from "@/icons/GbpSign";
import CadSign from "@/icons/CadSign";
import { UmojaLinnCurrency } from "@/types/project";
import { Euro, DollarSign } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useGetListNgnBanks,
  useGetPaymentAccountInfo,
  useRequestWithdrawal,
  useConnectStripeAccount,
  useRequestWithdrawOtp,
} from "@/tanstack/hooks/useProject";
import { Skeleton } from "@/components/ui/skeleton";
import { numberToCommaString, removeNonDigits } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/string";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const WithdrawalAmountForm = (props: { currency: UmojaLinnCurrency }) => {
  const { currency } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string | null>(null);
  const [withdrawOtp, setWithdrawOtp] = useState("");
  const [withdrawOtpModalOpen, setWithdrawOtpModalOpen] = useState(false);

  // New Hooks
  const {
    data: paymentAccountData,
    isPending: isLoadingAccount,
    isFetching,
  } = useGetPaymentAccountInfo();
  const { data: ngnBanksData } = useGetListNgnBanks({
    enabled: currency === "NAIRA",
  });
  const { mutate: requestWithdrawal, isPending: isRequestingWithdrawal } =
    useRequestWithdrawal({
      onSuccess: () => {
        toast({ description: "Withdrawal request submitted successfully!" });
        setWithdrawOtpModalOpen(false);
        setWithdrawOtp("");
        router.back();
      },
    });

  const { mutate: requestWithdrawOtp, isPending: isRequestingWithdrawOtp } =
    useRequestWithdrawOtp({
      onSuccess: () => {
        toast({
          description: "A verification code has been sent to your email.",
        });
        setWithdrawOtpModalOpen(true);
      },
    });

  const { mutate: connectStripe, isPending: isConnectingStripe } =
    useConnectStripeAccount({
      onSuccess: (data) => {
        if (data.data.data.onboardingUrl) {
          window.location.href = data.data.data.onboardingUrl;
        }
      },
    });

  const [isEditing, setIsEditing] = useState(false);

  // Find the account relevant to the current currency
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

  const getCurrencyDisplay = (curr: UmojaLinnCurrency) => {
    switch (curr) {
      case "EURO":
        return "EUR";
      case "NAIRA":
        return "NGN";
      default:
        return curr;
    }
  };

  // Logic to determine what to render
  const showSavedAccount = hasActiveAccount && !isEditing;
  const withdrawAmount = Number((amount || "").replace(/,/g, ""));
  const isValidWithdrawalAmount = !!amount && withdrawAmount > 0;

  return (
    <div className="flex flex-col gap-6">
      {showSavedAccount && (
        <TextField
          type="text"
          label="Withdrawal Amount"
          hint="Stripe may charge a small payout fee depending on your bank and payout method."
          hinticon
          placeholder="Amount to withdraw"
          value={numberToCommaString(amount || "")}
          onChange={(e) => {
            if (e.target.value.length > 27) return;
            const formattedValue = removeNonDigits(e.target.value);
            setAmount(formattedValue);
          }}
          startAdornment={
            currency === "EURO" ? (
              <Euro />
            ) : currency === "NAIRA" ? (
              <NairaSign />
            ) : currency === "USD" ? (
              <DollarSign />
            ) : currency === "GBP" ? (
              <GbpSign width={20} height={20} color="#000" />
            ) : currency === "CAD" ? (
              <CadSign width={20} height={20} color="#000" />
            ) : null
          }
        />
      )}
      {currency === "NAIRA" && showSavedAccount && (
        <p>
          <b>Estimated payout fee:</b>  ₦ X.XX (charged by our payment partner -
          Paystack)
        </p>
      )}

      {/* Account Section */}
      {isLoadingAccount || isFetching ? (
        <Skeleton className="h-40 w-full rounded-md" />
      ) : showSavedAccount ? (
        <div className=" py-4 flex gap-4 w-2/3">
          <h3 className="font-medium text-sm">Bank details</h3>
          <div className="flex-1">
            <div className="flex items-start gap-6 p-4 border">
              <Bank className="size-8 mt-1" />
              <div className="flex-1">
                {currency === "NAIRA" ? (
                  <>
                    <p className="font-semibold">
                      {paymentAccount?.paystackAccountName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getBankName(paymentAccount?.paystackBankCode || "")} •{" "}
                      {paymentAccount?.paystackAccountNumber}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary font-semibold text-sm mt-2 hover:underline p-0 h-auto"
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Stripe Account</p>
                    <p className="text-sm text-gray-600">
                      {paymentAccount?.stripeIban || ""} •{" "}
                      {paymentAccount?.stripeBankName}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary font-semibold text-sm mt-2 hover:underline p-0 h-auto"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Payments are processed by{" "}
              {currency === "NAIRA" ? "Paystack" : "Stripe"}. Payout fees are
              set by them.
            </p>
          </div>
        </div>
      ) : currency === "NAIRA" ? (
        <AddNairaAccountForm
          formTitle={isEditing ? "Edit Bank Details" : "Add Bank Details"}
          formDescription={`Add a ${capitalizeFirstLetter(currency.toLowerCase())} receiving account`}
          showCancelButton={isEditing}
          onCancel={() => setIsEditing(false)}
          onAddSuccess={() => router.push("/wallet")}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-base font-medium text-foreground mb-1">
              Connect Stripe to Accept {getCurrencyDisplay(currency)} projects
            </h1>
            <p className="text-foreground-body">
              To receive {getCurrencyDisplay(currency)} payments, you must
              connect a Stripe account
            </p>
          </div>
        </div>
      )}

      <Dialog
        open={withdrawOtpModalOpen}
        onOpenChange={setWithdrawOtpModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm withdrawal</DialogTitle>
            <DialogDescription>
              Enter the verification code sent to your email to complete this
              withdrawal request.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="withdrawal-otp">Verification code</Label>
            <TextField
              id="withdrawal-otp"
              placeholder="Enter code"
              value={withdrawOtp}
              autoComplete="one-time-code"
              inputMode="numeric"
              disabled={isRequestingWithdrawal}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setWithdrawOtp(digitsOnly);
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isRequestingWithdrawal || isRequestingWithdrawOtp}
              onClick={() => setWithdrawOtpModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={
                !isValidWithdrawalAmount ||
                !withdrawOtp.trim() ||
                isRequestingWithdrawal
              }
              onClick={() =>
                requestWithdrawal({
                  currency,
                  amount: withdrawAmount,
                  otp: withdrawOtp.trim(),
                })
              }
            >
              {isRequestingWithdrawal ? "Requesting..." : "Withdraw"}
            </Button>
          </DialogFooter>
          <button
            type="button"
            className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
            disabled={isRequestingWithdrawal || isRequestingWithdrawOtp}
            onClick={() => requestWithdrawOtp()}
          >
            {isRequestingWithdrawOtp ? "Sending code..." : "Resend code"}
          </button>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Action Footer */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          Back
        </Button>

        {showSavedAccount && (
          <Button
            disabled={!isValidWithdrawalAmount || isRequestingWithdrawOtp}
            onClick={() => {
              if (isValidWithdrawalAmount) {
                requestWithdrawOtp();
              }
            }}
          >
            {isRequestingWithdrawOtp ? "Sending code..." : "Request Withdrawal"}
          </Button>
        )}
        {!showSavedAccount && currency !== "NAIRA" && (
          <Button
            onClick={() => connectStripe()}
            disabled={isConnectingStripe}
            className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-semibold flex items-center gap-2 h-12 px-6"
          >
            <div className="flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.15396 4.77606C1.5 6.05953 1.5 7.73969 1.5 11.1V12.9C1.5 16.2603 1.5 17.9405 2.15396 19.2239C2.7292 20.3529 3.64708 21.2708 4.77606 21.846C6.05953 22.5 7.73969 22.5 11.1 22.5H12.9C16.2603 22.5 17.9405 22.5 19.2239 21.846C20.3529 21.2708 21.2708 20.3529 21.846 19.2239C22.5 17.9405 22.5 16.2603 22.5 12.9V11.1C22.5 7.73969 22.5 6.05953 21.846 4.77606C21.2708 3.64708 20.3529 2.7292 19.2239 2.15396C17.9405 1.5 16.2603 1.5 12.9 1.5H11.1C7.73969 1.5 6.05953 1.5 4.77606 2.15396C3.64708 2.7292 2.7292 3.64708 2.15396 4.77606Z"
                  fill="url(#paint0_linear_11954_542912)"
                />
                <path
                  d="M1.69892 6.20928C1.5 7.33974 1.5 8.83971 1.5 11.0996V12.8996C1.5 16.2599 1.5 17.9401 2.15396 19.2235C2.7292 20.3525 3.64708 21.2704 4.77606 21.8456C6.05953 22.4996 7.73969 22.4996 11.1 22.4996H12.9C16.2603 22.4996 17.9405 22.4996 19.2239 21.8456C20.3529 21.2704 21.2708 20.3525 21.846 19.2235C22.5 17.9401 22.5 16.2599 22.5 12.8996V11.0996C22.5 7.73929 22.5 6.05913 21.846 4.77566C21.2908 3.68597 20.4164 2.79293 19.341 2.21484L1.69892 6.20928Z"
                  fill="url(#paint1_linear_11954_542912)"
                />
                <path
                  d="M22.2827 17.8906C22.1863 18.3974 22.0471 18.8295 21.846 19.224C21.2708 20.353 20.3529 21.2709 19.224 21.8461C17.9789 22.4805 16.3605 22.4995 13.1972 22.5001H12.0439V20.1277L22.2827 17.8906Z"
                  fill="url(#paint2_linear_11954_542912)"
                />
                <path
                  d="M12.9 1.5H11.1C10.4462 1.5 9.85608 1.5 9.32007 1.50482V4.47789L19.339 2.21419C19.3009 2.19372 19.2625 2.17364 19.2239 2.15396C18.5114 1.79091 17.6766 1.62941 16.5 1.55757C15.5571 1.5 14.3948 1.5 12.9 1.5Z"
                  fill="url(#paint3_linear_11954_542912)"
                />
                <path
                  d="M22.5 13.0292C22.4999 15.2834 22.4959 16.7693 22.2827 17.8897L18.7217 18.6678V13.3611L22.5 12.4824V13.0292Z"
                  fill="url(#paint4_linear_11954_542912)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.2057 10.0329C11.2057 9.55093 11.5998 9.36554 12.2525 9.36554C13.1884 9.36554 14.3707 9.6498 15.3066 10.1565V7.25212C14.2845 6.84426 13.2746 6.68359 12.2525 6.68359C9.7525 6.68359 8.08997 7.99367 8.08997 10.1812C8.08997 13.5924 12.7697 13.0486 12.7697 14.5193C12.7697 15.0878 12.2771 15.2732 11.5875 15.2732C10.5653 15.2732 9.2599 14.853 8.22543 14.2845V17.226C9.37074 17.7203 10.5284 17.9305 11.5875 17.9305C14.149 17.9305 15.91 16.6575 15.91 14.4452C15.8977 10.7621 11.2057 11.4172 11.2057 10.0329Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_11954_542912"
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
                    id="paint1_linear_11954_542912"
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
                    id="paint2_linear_11954_542912"
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
                    id="paint3_linear_11954_542912"
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
                    id="paint4_linear_11954_542912"
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
            </div>
            {isConnectingStripe ? "Connecting..." : "Connect Stripe"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WithdrawalAmountForm;
