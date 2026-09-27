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
import { IBuyerIssueConfirmDialogProps } from "./@types";

export const BuyerIssueConfirmDialog = ({
  designerName,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  ...dialogProps
}: IBuyerIssueConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
      {open ? (
        <DialogContent className="flex max-w-[440px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[440px] sm:rounded-none">
          <DialogHeader className="space-y-4 px-6 pb-2 pt-8 text-center">
            <div className="mx-auto icon-wrapper warning h-14 w-14 border-4 [&_svg]:size-6">
              <Info className="rotate-180" />
            </div>
            <DialogTitle className="text-subtitle-2 text-gray-900 text-center font-semibold">
              Raise an Issue
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 px-6 pb-6 text-center text-sm leading-relaxed text-muted-foreground">
            <p>You&apos;re about to raise an issue for this project.</p>
            <p>
              <span className="font-medium text-foreground-body">
                {designerName}
              </span>{" "}
              will be notified and asked to respond.
            </p>
            <p>
              Our team will review the information provided and work to resolve
              the issue as fairly and quickly as possible.
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
              Raise Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default BuyerIssueConfirmDialog;
