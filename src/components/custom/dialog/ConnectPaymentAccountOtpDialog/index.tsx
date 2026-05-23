"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TextField from "@/components/custom/input/TextField";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentAccountOtpFormSchema } from "@/lib/schema";
import { useRequestConnectPaymentAccountOtp } from "@/tanstack/hooks/useProject";
import type {
  IConnectPaymentAccountOtpDialogProps,
  TConnectPaymentAccountOtpFormValues,
} from "./@types";

const defaultValues: TConnectPaymentAccountOtpFormValues = {
  otp: "",
};

const copyByIntent = {
  stripe: {
    title: "Connect Stripe",
    description:
      "Enter the verification code we sent to confirm connecting your Stripe account.",
    submit: "Connect Stripe",
    submitting: "Connecting…",
  },
  ngn: {
    title: "Add bank account",
    description:
      "Enter the verification code we sent to confirm adding your Naira bank account.",
    submit: "Add bank account",
    submitting: "Saving…",
  },
} as const;

export const ConnectPaymentAccountOtpDialog = ({
  open,
  onOpenChange,
  intent,
  onConfirm,
  isConfirming = false,
}: IConnectPaymentAccountOtpDialogProps) => {
  const otpRequestedForOpenCycleRef = useRef(false);
  const copy = copyByIntent[intent];

  const form = useForm<TConnectPaymentAccountOtpFormValues>({
    resolver: zodResolver(paymentAccountOtpFormSchema),
    defaultValues,
  });

  const { mutate: requestOtp, isPending: isRequestingOtp } =
    useRequestConnectPaymentAccountOtp();

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      otpRequestedForOpenCycleRef.current = false;
      return;
    }
    if (otpRequestedForOpenCycleRef.current) return;
    otpRequestedForOpenCycleRef.current = true;
    requestOtp(undefined, {
      onError: () => {
        otpRequestedForOpenCycleRef.current = false;
      },
    });
  }, [open, form, requestOtp]);

  const onSubmit = (values: TConnectPaymentAccountOtpFormValues) => {
    onConfirm(values.otp.trim());
  };

  const pending = isRequestingOtp || isConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">{copy.title}</DialogTitle>
          <DialogDescription className="text-left">
            {isRequestingOtp
              ? "Sending a verification code to your email…"
              : copy.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="connect-payment-account-otp">
                    Verification code
                  </Label>
                  <TextField
                    id="connect-payment-account-otp"
                    placeholder="Enter code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    disabled={pending}
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-semibold"
                disabled={pending || isRequestingOtp}
              >
                {isConfirming ? copy.submitting : copy.submit}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {!isRequestingOtp && (
          <button
            type="button"
            className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
            disabled={pending}
            onClick={() => requestOtp()}
          >
            Resend code
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPaymentAccountOtpDialog;
