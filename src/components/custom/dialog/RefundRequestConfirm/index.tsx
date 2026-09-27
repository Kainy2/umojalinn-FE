"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { IRefundRequestConfirmDialogProps } from "./@types";

export const RefundRequestConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  ...dialogProps
}: IRefundRequestConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
      {open ? (
      <DialogContent className="flex max-w-[440px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[440px] sm:rounded-none">
        <DialogHeader className="space-y-4 px-6 pb-2 pt-8 text-center">
          <div className="mx-auto icon-wrapper warning h-14 w-14 border-4 [&_svg]:size-6">
            <Info className="rotate-180" />
          </div>
          <DialogTitle className="text-subtitle-2 text-gray-900 text-center font-semibold">
            Refund Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6 text-center text-sm leading-relaxed text-muted-foreground">
          <p>
            You are requesting a refund for this project. If approved, the
            refund will be deducted from your earnings only. Umoja linn&apos;s
            commission will also be returned to the buyer and will not be
            charged to you.
          </p>
          <p>
            <span className="block font-medium text-foreground-body">
              Important:
            </span>
            If your balance is insufficient, your account may go negative.
            Withdrawals will be restricted until the balance is cleared.
          </p>
        </div>

        <DialogFooter className="flex-row gap-3 px-6 py-4 sm:space-x-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            loading={isPending}
            onClick={onConfirm}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default RefundRequestConfirmDialog;
