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
import { stripeDisconnectOtpFormSchema } from "@/lib/schema";
import {
  useRequestDeleteStripeAccountOtp,
  useDeleteStripeConnectedAccount,
} from "@/tanstack/hooks/useProject";
import { useToast } from "@/hooks/use-toast";
import type {
  IDisconnectStripeDialogProps,
  TStripeDisconnectOtpFormValues,
} from "./@types";

const defaultValues: TStripeDisconnectOtpFormValues = {
  otp: "",
};

export const DisconnectStripeDialog = ({
  open,
  onOpenChange,
}: IDisconnectStripeDialogProps) => {
  const { toast } = useToast();
  const otpRequestedForOpenCycleRef = useRef(false);

  const form = useForm<TStripeDisconnectOtpFormValues>({
    resolver: zodResolver(stripeDisconnectOtpFormSchema),
    defaultValues,
  });

  const { mutate: requestOtp, isPending: isRequestingOtp } =
    useRequestDeleteStripeAccountOtp();

  const { mutate: disconnectStripe, isPending: isDisconnecting } =
    useDeleteStripeConnectedAccount({
      onSuccess: () => {
        toast({
          description: "Your Stripe account has been disconnected.",
        });
        form.reset(defaultValues);
        otpRequestedForOpenCycleRef.current = false;
        onOpenChange(false);
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

  const onSubmit = (values: TStripeDisconnectOtpFormValues) => {
    disconnectStripe({ otp: values.otp.trim() });
  };

  const pending = isRequestingOtp || isDisconnecting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Disconnect Stripe</DialogTitle>
          <DialogDescription className="text-left">
            {isRequestingOtp
              ? "Sending a verification code to your email…"
              : "Enter the verification code we sent to confirm disconnecting your Stripe account."}
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
                  <Label htmlFor="stripe-disconnect-otp">
                    Verification code
                  </Label>
                  <TextField
                    id="stripe-disconnect-otp"
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
                variant="destructive"
                disabled={pending || isRequestingOtp}
              >
                {isDisconnecting ? "Disconnecting…" : "Disconnect Stripe"}
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

export default DisconnectStripeDialog;
