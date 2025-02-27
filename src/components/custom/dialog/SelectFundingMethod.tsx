"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Bank from "@/icons/Bank";
import { DialogProps } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import DialogListPickerItem from "./ListPickerItem";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Paypal from "@/icons/Paypal";

const PAYMENT_METHOD = ["OTHER", "PAYPAL"] as const;

type PaymentMethodType = (typeof PAYMENT_METHOD)[number];
export type PaymentFundingType = "milestone" | "project";

const getPaymentMethodUrl = (
  paymentMethod: PaymentMethodType,
  type: PaymentFundingType,
  id: string
) => {
  switch (paymentMethod) {
    case "OTHER":
    default:
      return `/fund/other/${type}/${id}`;
  }
};

const SelectFundingMethodDialog = (
  props: DialogProps & {
    id: string;
    type: PaymentFundingType;
  }
) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null
  );
  const router = useRouter();

  const getPaymentListProps = (prop: PaymentMethodType) => {
    switch (prop) {
      case "PAYPAL":
        return {
          icon: <Paypal />,
          title: "Paypal",
          description: "Coming soon",
          disabled: true,
        };
      case "OTHER":
      default:
        return {
          icon: <Wallet />,
          title: "Other Payment",
          description: "Other payment options",
        };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[30vw] lg:max-w-[150px]">
        <DialogHeader>
          <div className="icon-wrapper mb-1">
            <Bank />
          </div>
          <DialogTitle className="font-semibold text-subtitle-2 text-left">
            Select Funding Method
          </DialogTitle>
          <DialogDescription className="text-left">
            Please select a method to fund escrow
          </DialogDescription>
        </DialogHeader>
        {PAYMENT_METHOD.map((method) => (
          <DialogListPickerItem
            {...getPaymentListProps(method)}
            key={method}
            onClick={() => setPaymentMethod(method)}
            active={paymentMethod === method}
          />
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              fullWidth
              onClick={() =>
                !!paymentMethod &&
                router.push(
                  getPaymentMethodUrl(paymentMethod, props.type, props?.id)
                )
              }
              disabled={!paymentMethod}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectFundingMethodDialog;
