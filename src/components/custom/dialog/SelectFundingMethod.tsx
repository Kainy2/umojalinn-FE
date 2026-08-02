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
import { Wallet, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFundMilestone, useFundProject } from "@/tanstack/hooks/useProject";
import FundingFeesDialog from "@/components/custom/dialog/FundingFeesDialog";
import { useFundingFeesCheckout } from "@/hooks/useFundingFeesCheckout";

const PAYMENT_METHOD = ["CARD", "TRANSFER"] as const;

type PaymentMethodType = (typeof PAYMENT_METHOD)[number];
export type PaymentFundingType = "milestone" | "project";

const SelectFundingMethodDialog = (
  props: DialogProps & {
    id: string;
    currency: string;
    type: PaymentFundingType;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
  },
) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null,
  );

  const {
    feesDialogOpen,
    setFeesDialogOpen,
    payment,
    handleFundSuccess,
    handleProceedToCheckout,
  } = useFundingFeesCheckout();

  // Filter payment methods based on currency
  const availablePaymentMethods =
    props.currency?.toUpperCase() === "NAIRA"
      ? PAYMENT_METHOD
      : PAYMENT_METHOD.filter((method) => method === "TRANSFER");

  const getPaymentListProps = (prop: PaymentMethodType) => {
    switch (prop) {
      case "CARD":
        return {
          icon: <Wallet />,
          title: "Credit or Debit Card",
          description: "Fund escrow with your card",
        };
      case "TRANSFER":
      default:
        return {
          icon: <Landmark />,
          title: "Bank Transfer",
          description: "Transfer funds to provided bank details",
        };
    }
  };

  const fundMilestone = useFundMilestone({
    onSuccess: (data) => {
      handleFundSuccess(data?.data?.data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const fundProject = useFundProject(props.id, {
    onSuccess: (data) => {
      handleFundSuccess(data?.data?.data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return (
    <>
      <Dialog
        open={props.isOpen || open}
        onOpenChange={props.setIsOpen || setOpen}
        {...props}
      >
        <DialogTrigger
          asChild
          onClick={() =>
            props.setIsOpen ? props.setIsOpen(true) : setOpen(true)
          }
        >
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
          {availablePaymentMethods.map((method) => (
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
                loading={fundMilestone.isPending || fundProject.isPending}
                onClick={() => {
                  if (props.type === "milestone") {
                    fundMilestone.mutate(props.id);
                  } else {
                    fundProject.mutate();
                  }
                }}
                disabled={!paymentMethod}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FundingFeesDialog
        open={feesDialogOpen}
        onOpenChange={setFeesDialogOpen}
        fees={payment?.fees}
        currency={payment?.currency}
        onProceed={handleProceedToCheckout}
      />
    </>
  );
};

export default SelectFundingMethodDialog;
