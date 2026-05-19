"use client";

import CustomCheckbox from "@/components/custom/Checkbox";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextField from "@/components/custom/input/TextField";
import CustomReactSelect from "@/components/custom/ReactSelect";
import Bank from "@/icons/Bank";
import { useToast } from "@/hooks/use-toast";
import {
  useGetListNgnBanks,
  useVerifyNgnAccount,
  useAddNgnAccount,
} from "@/tanstack/hooks/useProject";
import { Button } from "@/components/ui/button";
import { MessageSquareWarning } from "lucide-react";
import React, { useState } from "react";
import type { IAddNairaAccountFormProps } from "./@types";

const defaultTitle = "Add Bank Details";
const defaultDescription = "Add a naira receiving account";

export const AddNairaAccountForm = ({
  formTitle = defaultTitle,
  formDescription = defaultDescription,
  showCancelButton = false,
  onCancel,
  onAddSuccess,
}: IAddNairaAccountFormProps) => {
  const { toast } = useToast();
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [verifiedName, setVerifiedName] = useState<string>("");
  const [agree, setAgree] = useState(false);

  const { data: ngnBanksData, isPending: loadingNgnBanks } = useGetListNgnBanks(
    { enabled: true },
  );
  const { mutate: verifyNgnAccount, isPending: isVerifying } =
    useVerifyNgnAccount();
  const { mutate: addNgnAccount, isPending: isAddingAccount } =
    useAddNgnAccount({
      onSuccess: () => {
        toast({ description: "Bank account added successfully!" });
        onAddSuccess?.();
      },
    });

  const getBankName = (code: string) => {
    return ngnBanksData?.data?.data?.find((b) => b.code === code)?.name || code;
  };

  const handleAutoVerify = (code: string, accNum: string) => {
    if (!code || accNum.length !== 10) return;

    verifyNgnAccount(
      { bankCode: code, accountNumber: accNum },
      {
        onSuccess: (data) => {
          setVerifiedName(data.data.data.accountName);
          toast({ description: "Account verified!" });
        },
        onError: () => {
          setVerifiedName("");
          toast({
            variant: "destructive",
            description: "Could not verify account.",
          });
        },
      },
    );
  };

  const handleSaveAccount = () => {
    if (!bankCode || !accountNumber || !verifiedName) return;
    addNgnAccount({
      bankCode,
      accountNumber,
      accountName: verifiedName,
    });
  };

  return (
    <FormItemWrapper title={formTitle} description={formDescription}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Account Holder
          </label>
          <TextField
            placeholder="Account name"
            value={verifiedName}
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
            options={
              ngnBanksData?.data?.data?.map((b) => ({
                label: b.name,
                value: b.code,
              })) || []
            }
            isLoading={loadingNgnBanks}
            onChange={(opt: unknown) => {
              const typedValue = opt as {
                value: string;
                label: string;
              };
              setBankCode(typedValue?.value);
              setVerifiedName("");
              if (accountNumber.length === 10) {
                handleAutoVerify(typedValue?.value, accountNumber);
              }
            }}
            value={
              bankCode
                ? { label: getBankName(bankCode), value: bankCode }
                : null
            }
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
            disabled={isVerifying}
            onChange={(e) => {
              const val = e.target.value;
              setAccountNumber(val);
              setVerifiedName("");

              if (val.length === 10 && bankCode) {
                handleAutoVerify(bankCode, val);
              }
            }}
          />
        </div>

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
                Incorrect and mismatched name and number can result in failed
                withdrawals and delays
              </p>
            </div>
          </div>

          {verifiedName && (
            <div className="p-4 border-2 bg-gray-50 rounded-sm">
              <CustomCheckbox
                checked={agree}
                onCheckedChange={(e: boolean) => setAgree(e)}
                label={{
                  children: (
                    <span className="text-sm">
                      I attest that i am the owner and i have full
                      authorizations to this bank account
                    </span>
                  ),
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-4">
          {showCancelButton && (
            <Button variant="ghost" type="button" onClick={() => onCancel?.()}>
              Cancel
            </Button>
          )}

          {verifiedName && (
            <Button
              type="button"
              disabled={!verifiedName || isAddingAccount || !agree}
              onClick={handleSaveAccount}
              className="w-full sm:w-auto"
            >
              {isAddingAccount ? "Saving..." : "Save Bank Details"}
            </Button>
          )}
        </div>
      </div>
    </FormItemWrapper>
  );
};

export default AddNairaAccountForm;
