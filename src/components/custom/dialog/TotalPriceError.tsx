"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency } from "@/types/project";
import { DialogProps, DialogTitle } from "@radix-ui/react-dialog";
import { CircleHelp } from "lucide-react";
import React from "react";

type TotalPriceErrorProps = DialogProps & {
  excess: number;
  currency: UmojaLinnCurrency | null;
  onConfirm: () => void;
  negotiable?: boolean;
};

const TotalPriceError = (props: TotalPriceErrorProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-2 flex-col lg:flex-row">
          <div className="icon-wrapper error mb-4">
            <CircleHelp />
          </div>
          <div>
            <DialogTitle className="font-semibold text-left">
              Total Price Error
            </DialogTitle>
            <DialogDescription className=" text-left">
              Your total price is{" "}
              <strong>
                {getCurrencySymbol(props?.currency)}
                {formatCurrencyValue(props.excess)}
              </strong>{" "}
              above the project budget
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-between lg:items-center flex-col lg:flex-row gap-2">
          <p className="text-sm">
            {props?.negotiable
              ? "Would you like to continue?"
              : "This budget is non-negotiable."}
          </p>
          <div className="flex w-full lg:w-auto flex-col lg:flex-row gap-2">
            <Button
              className="w-full lg:w-auto"
              onClick={() => props.onOpenChange?.(false)}
              variant="outline"
              type="button"
            >
              {props?.negotiable ? "No" : "Change Budget"}
            </Button>
            {props.negotiable && (
              <Button
                className="w-full lg:w-auto"
                variant="default"
                type="button"
                onClick={props?.onConfirm}
              >
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TotalPriceError;
