"use client";
import CustomCheckbox from "@/components/custom/Checkbox";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextField from "@/components/custom/input/TextField";
import CustomReactSelect from "@/components/custom/ReactSelect";
import Bank from "@/icons/Bank";
import NairaSign from "@/icons/NairaSign";
import { UmojaLinnCurrency } from "@/types/project";
import { Euro, MessageSquareWarning } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useGetListNgnBanks,
  useGetPaymentAccountInfo,
  useVerifyNgnAccount,
  useAddNgnAccount,
  useRequestWithdrawal
} from "@/tanstack/hooks/useProject";
import { Skeleton } from "@/components/ui/skeleton";
import { numberToCommaString, removeNonDigits } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/string";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type VerifyNgnAccountPayload = {
  bankCode: string;
  accountNumber: string;
};
export type AddNgnBankAccounyPaylod = {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}

export type RequestWithdrawalPayload = {
  currency: UmojaLinnCurrency;
  amount: number;

}

const WithdrawalAmountForm = (props: {
  currency: UmojaLinnCurrency;
}) => {
  const { currency } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string | null>(null);

  // New Hooks
  const { data: paymentAccountData, isPending: isLoadingAccount, isFetching } = useGetPaymentAccountInfo();
  const { data: ngnBanksData, isPending: loadingNgnBanks } = useGetListNgnBanks({
    enabled: currency === "NAIRA",
  });
  const { mutate: verifyNgnAccount, isPending: isVerifying } = useVerifyNgnAccount();
  const { mutate: addNgnAccount, isPending: isAddingAccount } = useAddNgnAccount({
    onSuccess: () => {
      toast({ description: "Bank account added successfully!" });
    }
  });



  const { mutate: requestWithdrawal, isPending: isRequestingWithdrawal } = useRequestWithdrawal({
    onSuccess: () => {
      toast({ description: "Withdrawal request submitted successfully!" });
      router.back();
    }
  });

  // State for NGN Form
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [verifiedName, setVerifiedName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [agree, setAgree] = useState(false); // Checkbox agreement state



  const paymentAccount = paymentAccountData?.data?.data;


  // Helper to find bank name from code
  const getBankName = (code: string) => {
    return ngnBanksData?.data?.data?.find(b => b.code === code)?.name || code;
  };

  const hasActiveAccount = useMemo(() => {
    if (!paymentAccount) return false;
    if (currency === "NAIRA") {
      return !!paymentAccount.paystackRecipientCode;
    }
    return !!paymentAccount.stripeAccountId;
  }, [paymentAccount, currency]);

  const handleVerify = () => {
    if (!bankCode || accountNumber.length < 10) return;
    verifyNgnAccount({ bankCode, accountNumber }, {
      onSuccess: (data) => {
        setVerifiedName(data.data.data.accountName);
        toast({ description: "Account verified!" });
      },
      onError: () => {
        setVerifiedName("");
        toast({ variant: "destructive", description: "Could not verify account." });
      }
    });
  };

  const handleSaveAccount = () => {
    if (!bankCode || !accountNumber || !verifiedName) return;
    addNgnAccount({
      bankCode,
      accountNumber,
      accountName: verifiedName
    });
  };

  // Logic to determine what to render
  const showSavedAccount = hasActiveAccount && !isEditing;

  return (
    <div className="flex flex-col gap-6">
      {/* Withdrawal Amount Input - Always show if intended to be part of the flow, 
            or maybe only if account exists? The image shows it. */}

      <TextField
        type="text"
        label="Withdrawal Amount"
        placeholder="Amount to withdraw"
        value={numberToCommaString(amount || "")}
        onChange={(e) => {
          if (e.target.value.length > 27) return
          const formattedValue = removeNonDigits(e.target.value)
          setAmount(formattedValue)
        }}
        startAdornment={
          currency === "EURO" ? (
            <Euro className="size-4 text-foreground-body" />
          ) : (
            <NairaSign className="size-4 text-foreground-body" />
          )
        }
      />

      {/* Account Section */}
      {isLoadingAccount || isFetching ? (
        <Skeleton className="h-40 w-full rounded-md" />
      ) : showSavedAccount ? (
        <div className="border rounded-md p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Bank details</h3>
          <div className="flex items-start gap-4 p-4 border rounded-md bg-gray-50/50">
            <Bank className="size-8 mt-1" />
            <div className="flex-1">
              {currency === "NAIRA" ? (
                <>
                  <p className="font-semibold">{paymentAccount?.paystackAccountName}</p>
                  <p className="text-sm text-gray-600">
                    {getBankName(paymentAccount?.paystackBankCode || "")} • {paymentAccount?.paystackAccountNumber}
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
                    {paymentAccount?.stripeIban || "N/A"}
                  </p>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Payments are processed by {currency === "NAIRA" ? "Paystack" : "Stripe"}. Payout fees are set by them.
          </p>
        </div>
      ) : currency === "NAIRA" ? (
        <FormItemWrapper
          title={isEditing ? "Edit Bank Details" : "Add Bank Details"}
          description={`Add a ${capitalizeFirstLetter(currency.toLowerCase())} receiving account`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Account Holder
              </label>
              <TextField
                placeholder="Account name"
                value={verifiedName} // READ-ONLY: Populated by verification
                readOnly
                disabled
                className="bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Bank Name
              </label>
              <CustomReactSelect
                placeholder="Name of bank"
                options={ngnBanksData?.data?.data?.map(b => ({ label: b.name, value: b.code })) || []}
                isLoading={loadingNgnBanks}
                onChange={(opt: unknown) => {
                  const typedValue = opt as {
                    value: string;
                    label: string;
                  };
                  setBankCode(typedValue?.value);
                  setVerifiedName("");
                }}
                value={bankCode ? { label: getBankName(bankCode), value: bankCode } : null}
                startAdornment={<Bank className="size-5 text-gray-400" />}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Account Number
              </label>
              <TextField
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setVerifiedName(""); // Reset verification if number changes
                }}
              />
            </div>

            {/* Hint Text */}
            <p className="text-xs text-gray-500">
              This is a hint text to help user.
            </p>

            {/* Verification Warning / Checkbox Zone */}
            <div className="bg-error-50/70 border-2 border-error/50 rounded-lg p-4">
              <div className="flex gap-2 mb-4">
                <span className="icon-wrapper error text-error">
                  <MessageSquareWarning className="size-5" />
                </span>
                <div className="text-error text-sm">
                  <p className="font-semibold">
                    Double check - your account details
                  </p>
                  <p>
                    Incorrect and mismatched name and number can result
                    in failed withdrawals and delays
                  </p>
                </div>
              </div>

              {/* Checkbox only enabled if verified? Or always there? 
                                Legacy logic usually requires user to check this before saving.
                            */}
              {verifiedName && (
                <div className="p-4 border-2 bg-gray-50 rounded-sm">
                  <CustomCheckbox
                    checked={agree}
                    onCheckedChange={(e: boolean) => setAgree(e)}
                    label={{
                      children: (
                        <span className="text-sm">
                          I attest that i am the owner and i have full authorizations to this bank account
                        </span>
                      ),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end mt-4">

              {isEditing && (
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              )}

              {!verifiedName ? (
                <Button
                  type="button"
                  disabled={!bankCode || accountNumber.length < 10 || isVerifying}
                  onClick={handleVerify}
                  className="w-full sm:w-auto"
                >
                  {isVerifying ? "Verifying..." : "Verify Account"}
                </Button>
              ) : (
                <Button
                  disabled={!verifiedName || isAddingAccount || !agree} // Require agreement
                  onClick={handleSaveAccount}
                  className="w-full sm:w-auto"
                >
                  {isAddingAccount ? "Saving..." : "Save Bank Details"}
                </Button>
              )}
            </div>
          </div>
        </FormItemWrapper>
      ) : null}

      {/* Withdrawal Action Footer */}
      {showSavedAccount && (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>Back</Button>

          <Button
            disabled={!amount || Number(amount?.replace(/,/g, '')) <= 0 || isRequestingWithdrawal}
            onClick={() => {
              if (amount) {
                requestWithdrawal({
                  currency,
                  amount: Number(amount.replace(/,/g, '')),
                });
              }
            }}
          >
            {isRequestingWithdrawal ? "Requesting..." : "Request Withdrawal"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WithdrawalAmountForm;
