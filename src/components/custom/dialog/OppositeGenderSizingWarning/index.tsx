"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CircleHelp } from "lucide-react";
import React from "react";
import { IOppositeGenderSizingWarningProps } from "./@types";

const OppositeGenderSizingWarning = ({
  description,
  onConfirm,
  pendingConfirm = false,
  title = "Confirm Sizing Template",
  ...props
}: IOppositeGenderSizingWarningProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-2 flex-col lg:flex-row">
          <div className="icon-wrapper error mb-4">
            <CircleHelp />
          </div>
          <div>
            <DialogTitle className="font-semibold text-left">
              {title}
            </DialogTitle>
            <DialogDescription className="text-left">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-between lg:items-center flex-col lg:flex-row gap-2">
          <p className="text-sm">Would you like to continue?</p>
          <div className="flex w-full lg:w-auto flex-col lg:flex-row gap-2">
            <Button
              className="w-full lg:w-auto"
              onClick={() => props.onOpenChange?.(false)}
              variant="outline"
              type="button"
            >
              No
            </Button>
            <Button
              className="w-full lg:w-auto"
              variant="default"
              type="button"
              loading={pendingConfirm}
              onClick={onConfirm}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OppositeGenderSizingWarning;
