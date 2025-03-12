"use client";
import CustomCheckbox from "@/components/custom/Checkbox";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextAreaField from "@/components/custom/input/TextAreaField";
import TextField from "@/components/custom/input/TextField";
import CustomSelect from "@/components/custom/Select";
import Bank from "@/icons/Bank";
import NairaSign from "@/icons/NairaSign";
import { UmojaLinnCurrency, UmojaLinnWithdrawalMethod } from "@/types/project";
import { Euro, Mail, MessageSquareWarning } from "lucide-react";
import React, { useState } from "react";
import ProjectEditFooter from "../project/edit/Footer";
import {
  useCreateWithdrawalMethod,
  useGetWithdrawalMethods,
  useRequestWithdrawal,
} from "@/tanstack/hooks/useProject";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Paypal from "@/icons/Paypal";
import CheckCircle from "@/icons/CheckCircle";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const noPaypalOption = [
  {
    children: <span>Direct transfer </span>,
    value: "DIRECT_TRANSFER",
  },
];
const paypalOption = [
  {
    children: <span>Direct transfer </span>,
    value: "DIRECT_TRANSFER",
  },
  {
    children: <span>Paypal</span>,
    value: "PAYPAL",
  },
];

const getOptions = (currency: UmojaLinnCurrency) => {
  if (currency === "NAIRA") {
    return noPaypalOption;
  }
  return paypalOption;
};

const getIcon = (channel: UmojaLinnWithdrawalMethod["channel"]) => {
  switch (channel) {
    case "PAYPAL":
      return <Paypal className="shrink-0 mt-2" />;
    default:
      return <Bank className="shrink-0 mt-1" />;
  }
};

export type RequestWithdrawalPayload = {
  currency: UmojaLinnCurrency;
  amount: number;
  withdrawalMethodId: string;
};
export type PaypalPayload = {
  paypalEmail: string;
};
export type DirectTransferPayload = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  bankAddress: string;
  iban: string;
  swiftCode: string;
};

export type CreateWithdrawalMethodPayload = {
  channel: UmojaLinnWithdrawalMethod["channel"];
  currency: UmojaLinnCurrency;
} & (PaypalPayload | DirectTransferPayload);

const WithdrawalAmountForm = (props: {
  currency: UmojaLinnCurrency;
  mode?: "WITHDRAWAL" | "PAYMENT";
}) => {
  const { currency, mode = "WITHDRAWAL" } = props;
  const [paymentMethod, setPaymentMethod] = useState<
    null | UmojaLinnWithdrawalMethod["channel"]
  >(null);
  const [agree, setAgree] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const [withdrawalMethod, setWithdrawalMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const { data: withdrawalMethodsData, isPending: loadingWithdrawalMethods } =
    useGetWithdrawalMethods();

  const [paypalPayload, setPaypalPayload] = useState<PaypalPayload>({
    paypalEmail: "",
  });

  const [directTransferPayload, setDirectTransferPayload] =
    useState<DirectTransferPayload>({
      accountName: "",
      bankName: "",
      accountNumber: "",
      bankAddress: "",
      iban: "",
      swiftCode: "",
    });

  const handlePaypalPayloadChange = (
    prop: keyof PaypalPayload,
    value: string,
  ) => {
    setPaypalPayload((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleDirectTransferChange = (
    prop: keyof DirectTransferPayload,
    value: string,
  ) => {
    setDirectTransferPayload((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const {
    mutate: createWithdrawalMethod,
    isPending: isCreatingWithdrawalMethod,
  } = useCreateWithdrawalMethod({
    onSuccess() {
      setPaypalPayload({
        paypalEmail: "",
      });
      setDirectTransferPayload({
        accountName: "",
        bankName: "",
        accountNumber: "",
        bankAddress: "",
        iban: "",
        swiftCode: "",
      });
      setPaymentMethod(null);
      toast({
        description: "Withdrawal method has been successfully created!!!",
      });
    },
  });
  const { mutate: requestWithdrawal, isPending: isRequestingWithdrawal } =
    useRequestWithdrawal({
      onSuccess() {
        setPaypalPayload({
          paypalEmail: "",
        });
        setDirectTransferPayload({
          accountName: "",
          bankName: "",
          accountNumber: "",
          bankAddress: "",
          iban: "",
          swiftCode: "",
        });
        setPaymentMethod(null);
        router.push("/wallet");
        toast({ description: "Withdrawal has been successfully requested!!!" });
      },
    });

  const handleContinue = () => {
    if (!withdrawalMethod) {
      if (!paymentMethod) return;
      return createWithdrawalMethod({
        channel: paymentMethod!,
        currency,
        ...(paymentMethod === "DIRECT_TRANSFER"
          ? directTransferPayload
          : paypalPayload),
      });
    }
    return requestWithdrawal({
      currency,
      withdrawalMethodId: withdrawalMethod,
      amount: parseInt(amount || ""),
    });
  };

  const withdrawalMethodsForThisCurrency =
    withdrawalMethodsData?.data?.data?.filter(
      (method) => method?.currency === currency,
    );

  return (
    <div className="flex flex-col gap-6">
      {
        <>
          {mode === "WITHDRAWAL" &&
            !!withdrawalMethodsForThisCurrency?.length && (
              <TextField
                type="number"
                label="Withdraw Amount"
                placeholder="Amount to withdraw"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value)}
                startAdornment={
                  currency === "EURO" ? (
                    <Euro className="size-4 text-foreground-body" />
                  ) : (
                    <NairaSign className="size-4 text-foreground-body" />
                  )
                }
              />
            )}
          <FormItemWrapper
            title="Withdrawal details"
            description="Select withdrawal method"
          >
            <div className="flex flex-col gap-6">
              <>
                {loadingWithdrawalMethods &&
                  new Array(3)
                    .fill("")
                    .map((_, i) => (
                      <Skeleton key={_ + i} className="h-28 rounded-md" />
                    ))}
                {withdrawalMethodsForThisCurrency?.map?.((method) => (
                  <div
                    onClick={() =>
                      mode === "WITHDRAWAL" &&
                      setWithdrawalMethod((prev) =>
                        prev === method?.id ? null : method.id,
                      )
                    }
                    key={method.id}
                    className={cn(
                      "p-4 rounded-md border relative flex gap-4",
                      withdrawalMethod === method?.id && "border-primary",
                      mode === "WITHDRAWAL" && "cursor-pointer",
                    )}
                  >
                    {getIcon(method?.channel)}
                    <div className="text-foreground-body">
                      <p>{method?.paypalEmail || method?.bankName}</p>
                      <p className="text-sm mb-2">{method?.accountNumber}</p>
                      <div className="flex items-center gap-2">
                        {withdrawalMethod !== method?.id && (
                          <span className="font-bold">Set as default</span>
                        )}
                        <button className="text-primary font-semibold">
                          Edit
                        </button>
                      </div>
                    </div>
                    {withdrawalMethod === method?.id ? (
                      <CheckCircle className="size-5 text-primary shrink-0 absolute top-4 right-4" />
                    ) : (
                      <span className="border border-gray-400 rounded-full size-5 shrink-0 absolute top-4 right-4" />
                    )}
                  </div>
                ))}
              </>
              <CustomSelect
                value={paymentMethod || ""}
                placeholder="Add withdrawal details"
                onValueChange={(value: UmojaLinnWithdrawalMethod["channel"]) =>
                  setPaymentMethod(value)
                }
                options={getOptions(currency)}
              />
              {paymentMethod === "PAYPAL" && (
                <TextField
                  placeholder="Your email address"
                  value={paypalPayload.paypalEmail}
                  onChange={(e) =>
                    handlePaypalPayloadChange("paypalEmail", e.target.value)
                  }
                  startAdornment={
                    <Mail className="size-5 text-foreground-body" />
                  }
                />
              )}
              {paymentMethod === "DIRECT_TRANSFER" && (
                <div className="flex flex-col gap-6">
                  <TextField
                    label="Account Holder"
                    placeholder="Account Name"
                    value={directTransferPayload.accountName}
                    onChange={(e) =>
                      handleDirectTransferChange("accountName", e.target.value)
                    }
                  />
                  <div className="flex flex-col lg:flex-row gap-6">
                    <TextField
                      placeholder="Name of Bank"
                      label="Bank Name"
                      startAdornment={<Bank className="size-5" />}
                      value={directTransferPayload.bankName}
                      onChange={(e) =>
                        handleDirectTransferChange("bankName", e.target.value)
                      }
                    />
                  </div>
                  <TextField
                    placeholder="Account number"
                    label="Account number"
                    value={directTransferPayload.accountNumber}
                    onChange={(e) =>
                      handleDirectTransferChange(
                        "accountNumber",
                        e.target.value,
                      )
                    }
                  />
                  <TextAreaField
                    label="Bank Address"
                    placeholder="Address of Bank"
                    value={directTransferPayload.bankAddress}
                    onChange={(e) =>
                      handleDirectTransferChange("bankAddress", e.target.value)
                    }
                  />
                  <div className="flex flex-col lg:flex-row gap-6">
                    <TextField
                      placeholder="Bank IBAN"
                      label="IBAN"
                      value={directTransferPayload.iban}
                      onChange={(e) =>
                        handleDirectTransferChange("iban", e.target.value)
                      }
                    />
                    <TextField
                      placeholder="Bank Swift code"
                      label="Swift code"
                      value={directTransferPayload.swiftCode}
                      onChange={(e) =>
                        handleDirectTransferChange("swiftCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6"></div>
                  <div>
                    <p className="text-sm text-foreground-body mb-2">
                      This is a hint to help user
                    </p>
                    <div className="bg-error-50/70 border-2 border-error/50 rounded-lg p-4">
                      <div className="flex gap-2 mb-4">
                        <span className="icon-wrapper error">
                          <MessageSquareWarning />
                        </span>
                        <div className="text-error">
                          <p className="font-semibold">
                            Double check your account details
                          </p>
                          <p>
                            Incorrect and mismatched name and number can result
                            in failed withdrawals and delays
                          </p>
                        </div>
                      </div>
                      <div className="p-4 border-2 bg-gray-50 rounded-sm">
                        <CustomCheckbox
                          checked={agree}
                          onCheckedChange={(e: boolean) => setAgree(e)}
                          label={{
                            children: (
                              <span className="text-sm">
                                I attest that I am the owner and I have full
                                authorizations to this bank account
                              </span>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormItemWrapper>
        </>
      }
      <ProjectEditFooter
        hideDraft
        saveText={
          mode === "PAYMENT" || !paymentMethod
            ? "Save details"
            : "Proceed to withdrawal"
        }
        handleSave={handleContinue}
        loading={
          isCreatingWithdrawalMethod ||
          isRequestingWithdrawal ||
          loadingWithdrawalMethods ||
          (withdrawalMethod && !amount) ||
          (paymentMethod === "DIRECT_TRANSFER" && !agree)
        }
      />
    </div>
  );
};

export default WithdrawalAmountForm;
