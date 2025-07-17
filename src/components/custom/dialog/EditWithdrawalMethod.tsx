import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Bank from "@/icons/Bank";
import { capitalizeFirstLetter } from "@/lib/string";
import {
  DirectTransferPayload,
  PaypalPayload,
} from "@/section/form/withdraw/WithdrawalAmount";
import {
  useDeleteWithdrawalMethod,
  useEditWithdrawalMethod,
} from "@/tanstack/hooks/useProject";
import React, { useState } from "react";
import TextField from "../input/TextField";
import TextAreaField from "../input/TextAreaField";
import { Mail } from "lucide-react";
import { getTransactionIcon } from "@/components/util/wallet";
import {  UmojaLinnWithdrawalMethod } from "@/types/project";

const EditWithdrawalMethod = (props: {
    selectedWithdrawalMethod: UmojaLinnWithdrawalMethod,
    onSuccess: () => void
  }) => {
    const { selectedWithdrawalMethod} = props
  const [editWithdrawalMethodPayload, setEditWithdrawalMethodPayload] =
    useState<Partial<PaypalPayload & DirectTransferPayload>>({
				paypalEmail: selectedWithdrawalMethod.paypalEmail ?? undefined,
				accountName: selectedWithdrawalMethod.accountName ?? undefined,
				bankName: selectedWithdrawalMethod.bankName ?? undefined,
				accountNumber: selectedWithdrawalMethod.accountNumber ?? undefined,
				bankAddress: selectedWithdrawalMethod.bankAddress ?? undefined,
				...(selectedWithdrawalMethod.currency === "EURO" && {
          iban: selectedWithdrawalMethod.iban ?? undefined,
				swiftCode: selectedWithdrawalMethod.swiftCode ?? undefined,
      })
    });

  const { mutate: editWithdrawalMethod, isPending: isEditing } =
    useEditWithdrawalMethod(selectedWithdrawalMethod.id, {
      onSuccess() {
        props.onSuccess()
   },
    });
  const { mutate: deleteWithdrawalMethod, isPending: isDeleting } =
    useDeleteWithdrawalMethod(selectedWithdrawalMethod.id, {
      onSuccess() {
        props.onSuccess()   
   },

    });

  const title = capitalizeFirstLetter(
    selectedWithdrawalMethod.channel || ""
  )?.replaceAll?.("_", " ");

  const icon = getTransactionIcon(selectedWithdrawalMethod.channel);

  const handlePayloadChange = (
    prop: keyof typeof editWithdrawalMethodPayload,
    value: string
  ) => {
    setEditWithdrawalMethodPayload((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleSubmit = () => {
    if (selectedWithdrawalMethod) {
      // @ts-expect-error Withdrawal method type is conditional
      // editWithdrawalMethod({
      //   channel: withdrawalMethod?.channel,
      //   currency: withdrawalMethod?.currency,
      //   ...editWithdrawalMethodPayload,
      // });
      
      editWithdrawalMethod(editWithdrawalMethodPayload);
    }
  };

  return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <span className="size-7 border border-border/20 rounded-md flex items-center justify-center [&>*]:size-5 mb-2">
            {icon}
          </span>
          <DialogTitle className="font-semibold">{title}</DialogTitle>
          <DialogDescription>
            Update your {title?.toLocaleLowerCase?.()} details
          </DialogDescription>
        </DialogHeader>
          <FormContent
            withdrawalMethod={selectedWithdrawalMethod}
            handlePayloadChange={handlePayloadChange}
            editWithdrawalMethodPayload={editWithdrawalMethodPayload}
          />
        <DialogFooter className="flex gap-4 flex-col md:flex-row">
          <Button
            fullWidth
            variant="outline"
            type="button"
            disabled={isDeleting || isEditing}
            onClick={() => deleteWithdrawalMethod()}
          >
            Remove from wallet
          </Button>
          <Button
            fullWidth
            variant="default"
            type="button"
            onClick={handleSubmit}
            disabled={isDeleting || isEditing}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>

  );
};



  const FormContent = ({ 
    withdrawalMethod, 
    handlePayloadChange,
    editWithdrawalMethodPayload
  }:{
    withdrawalMethod: UmojaLinnWithdrawalMethod,
    handlePayloadChange: (prop: keyof typeof editWithdrawalMethodPayload, value: string) => void,
    editWithdrawalMethodPayload: Partial<PaypalPayload & DirectTransferPayload>
  }) => {
    switch (withdrawalMethod?.channel) {
      case "PAYPAL":
        return (
          <TextField
            placeholder="Your email address"
            value={editWithdrawalMethodPayload.paypalEmail}
            onChange={(e) => handlePayloadChange("paypalEmail", e.target.value)}
            // onChange={(e) => setPayPalEmail(e.target.value)}
            startAdornment={<Mail className="size-5 text-foreground-body" />}
          />
        );
      case "DIRECT_TRANSFER":
      default:
        return (
          <div className="flex flex-col gap-6">
            <TextField
              label="Account Holder"
              placeholder="Account Name"
              value={editWithdrawalMethodPayload?.accountName}
              onChange={(e) =>
                handlePayloadChange("accountName", e.target.value)
              }
            />
            <div className="flex flex-col lg:flex-row gap-6">
              <TextField
                placeholder="Name of Bank"
                label="Bank Name"
                startAdornment={<Bank className="size-5" />}
                value={editWithdrawalMethodPayload?.bankName}
                onChange={(e) =>
                  handlePayloadChange("bankName", e.target.value)
                }
              />
            </div>
            <TextField
              placeholder="Account number"
              label="Account number"
              value={editWithdrawalMethodPayload?.accountNumber}
              onChange={(e) =>
                handlePayloadChange("accountNumber", e.target.value)
              }
            />
            <TextAreaField
              label="Bank Address"
              placeholder="Address of Bank"
              value={editWithdrawalMethodPayload?.bankAddress}
              onChange={(e) =>
                handlePayloadChange("bankAddress", e.target.value)
              }
            />
           {withdrawalMethod.currency === "EURO" && <div className="flex flex-col lg:flex-row gap-6">
              <TextField
                placeholder="Bank IBAN"
                label="IBAN"
                value={editWithdrawalMethodPayload?.iban}
                onChange={(e) => handlePayloadChange("iban", e.target.value)}
              />
              <TextField
                placeholder="Bank Swift code"
                label="Swift code"
                value={editWithdrawalMethodPayload?.swiftCode}
                onChange={(e) =>
                  handlePayloadChange("swiftCode", e.target.value)
                }
              />
            </div>}
          </div>
        );
    }
  };


export default EditWithdrawalMethod;
