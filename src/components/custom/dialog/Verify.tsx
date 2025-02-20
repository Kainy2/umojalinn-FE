"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import React from "react";

type VerifyDialogProps = {
  children: React.ReactNode;
  onConfirm: React.ComponentProps<"button">["onClick"];
  title: string;
  description: React.ReactNode;
  additionalComponent?: React.ReactNode;
  destructive?: boolean;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  fullWidthActions?: boolean;
  disableActions?: boolean;
};

const VerifyDialog = (props: VerifyDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold">{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        {props.additionalComponent}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              fullWidth={props.fullWidthActions}
              variant={props.destructive ? "destructive" : "default"}
              type="submit"
              onClick={props?.onConfirm}
              disabled={props.disableActions}
            >
              {props.confirmText || "Continue"}
            </Button>
          </DialogClose>
          {!props.hideCancel && (
            <DialogClose asChild>
              <Button
                fullWidth={props.fullWidthActions}
                variant="outline"
                type="button"
                disabled={props.disableActions}
              >
                {props.cancelText || "Cancel"}
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyDialog;
