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
  useGetWithdrawalMethods,
} from "@/tanstack/hooks/useProject";
import React, { useEffect, useState } from "react";
import TextField from "../input/TextField";
import TextAreaField from "../input/TextAreaField";
import { Mail } from "lucide-react";
import { getTransactionIcon } from "@/components/util/wallet";
import { UmojaLinnWithdrawalMethod } from "@/types/project";

const EditWithdrawalMethod = (props: {
    id: string
    onSuccess: () => void
  }) => {
  const [editWithdrawalMethodPayload, setEditWithdrawalMethodPayload] =
    useState<Partial<PaypalPayload & DirectTransferPayload>>({});

  const { data: withdrawalMethodsData } = useGetWithdrawalMethods();
  const { mutate: editWithdrawalMethod, isPending: isEditing } =
    useEditWithdrawalMethod(props.id, {
      onSuccess() {
        props.onSuccess()
   },
    });
  const { mutate: deleteWithdrawalMethod, isPending: isDeleting } =
    useDeleteWithdrawalMethod(props.id, {
      onSuccess() {
        props.onSuccess()   
   },

    });

  const withdrawalMethod = withdrawalMethodsData?.data?.data?.find(
    (method) => method?.id === props.id
  );

  const title = capitalizeFirstLetter(
    withdrawalMethod?.channel || ""
  )?.replaceAll?.("_", " ");

  const icon =
    withdrawalMethod?.channel && getTransactionIcon(withdrawalMethod?.channel);

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
    if (withdrawalMethod) {
      // @ts-expect-error Withdrawal method type is conditional
      editWithdrawalMethod({
        channel: withdrawalMethod?.channel,
        currency: withdrawalMethod?.currency,
        ...editWithdrawalMethodPayload,
      });
    }
  };

  useEffect(() => {
		if (withdrawalMethod) {
			setEditWithdrawalMethodPayload({
				paypalEmail: withdrawalMethod?.paypalEmail ?? undefined,
				accountName: withdrawalMethod?.accountName ?? undefined,
				bankName: withdrawalMethod?.bankName ?? undefined,
				accountNumber: withdrawalMethod?.accountNumber ?? undefined,
				bankAddress: withdrawalMethod?.bankAddress ?? undefined,
				iban: withdrawalMethod?.iban ?? undefined,
				swiftCode: withdrawalMethod?.swiftCode ?? undefined,
			});
		}
  }, [withdrawalMethod]);

  if (!withdrawalMethod) return null;

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
            withdrawalMethod={withdrawalMethod}
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
            <div className="flex flex-col lg:flex-row gap-6">
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
            </div>
          </div>
        );
    }
  };


export default EditWithdrawalMethod;
