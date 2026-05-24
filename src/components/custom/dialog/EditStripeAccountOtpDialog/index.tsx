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
import {
  useRequestConnectPaymentAccountOtp,
  useVerifyConnectPaymentAccountOtp,
} from "@/tanstack/hooks/useProject";
import type {
  IEditStripeAccountOtpDialogProps,
  TEditStripeAccountOtpFormValues,
} from "./@types";

const defaultValues: TEditStripeAccountOtpFormValues = {
  otp: "",
};

export const EditStripeAccountOtpDialog = ({
  open,
  onOpenChange,
  stripeOnboardingUrl,
  onNoOnboardingUrl,
}: IEditStripeAccountOtpDialogProps) => {
  const otpRequestedForOpenCycleRef = useRef(false);

  const form = useForm<TEditStripeAccountOtpFormValues>({
    resolver: zodResolver(paymentAccountOtpFormSchema),
    defaultValues,
  });

  const { mutate: requestOtp, isPending: isRequestingOtp } =
    useRequestConnectPaymentAccountOtp();

  const { mutate: verifyOtp, isPending: isVerifying } =
    useVerifyConnectPaymentAccountOtp({
      onSuccess: (data) => {
        form.reset(defaultValues);
        otpRequestedForOpenCycleRef.current = false;
        onOpenChange(false);

        const onboardingUrl =
          data?.data?.data?.onboardingUrl ?? stripeOnboardingUrl;
        if (onboardingUrl) {
          window.open(onboardingUrl, "_blank", "noopener,noreferrer");
          return;
        }
        onNoOnboardingUrl?.();
      },
    });

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

  const onSubmit = (values: TEditStripeAccountOtpFormValues) => {
    verifyOtp({ otp: values.otp.trim() });
  };

  const pending = isRequestingOtp || isVerifying;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Edit Stripe details</DialogTitle>
          <DialogDescription className="text-left">
            {isRequestingOtp
              ? "Sending a verification code to your email…"
              : "Enter the verification code we sent to confirm editing your Stripe account."}
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
                  <Label htmlFor="edit-stripe-account-otp">
                    Verification code
                  </Label>
                  <TextField
                    id="edit-stripe-account-otp"
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
                {isVerifying ? "Verifying…" : "Continue to Stripe"}
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

export default EditStripeAccountOtpDialog;
