"use client";

import React from "react";
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
import CustomSelectCountry from "@/components/custom/SelectCountry";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stripeLinkAddressFormSchema } from "@/lib/schema";
// import { useGetMe } from "@/tanstack/hooks/useUser";
import {
  useAddPaymentAddress,
  useConnectStripeAccount,
} from "@/tanstack/hooks/useProject";
import type {
  ILinkStripeAddressDialogProps,
  TStripeLinkAddressFormValues,
} from "./@types";

const defaultValues: TStripeLinkAddressFormValues = {
  country: "",
  state: "",
  city: "",
  zipCode: "",
  address: "",
};

export const LinkStripeAddressDialog = ({
  open,
  onOpenChange,
}: ILinkStripeAddressDialogProps) => {
  // const { data: meResponse } = useGetMe();
  // const user = meResponse?.data?.data;

  const form = useForm<TStripeLinkAddressFormValues>({
    resolver: zodResolver(stripeLinkAddressFormSchema),
    defaultValues,
  });

  // useEffect(() => {
  //   if (!open || !user) return;
  //   form.reset({
  //     country:  "",
  //     state: user.address?.state ?? "",
  //     city: user.address?.city ?? "",
  //     zipCode: user.address?.zipCode ?? "",
  //     address: user.address?.address ?? "",
  //   });
  // }, [open, user, form]);

  const { mutate: connectStripeAccount, isPending: isConnectingStripe } =
    useConnectStripeAccount({
      onSuccess: (data) => {
        if (data.data.data.onboardingUrl) {
          window.location.href = data.data.data.onboardingUrl;
        }
      },
    });

  const { mutate: submitPaymentAddress, isPending: isSavingAddress } =
    useAddPaymentAddress({
      onSuccess: () => {
        connectStripeAccount();
      },
    });

  const isPending = isSavingAddress || isConnectingStripe;

  const onSubmit = (values: TStripeLinkAddressFormValues) => {
    submitPaymentAddress({
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      country: values.country.trim().toUpperCase(),
      zipCode: values.zipCode.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">Stripe payout address</DialogTitle>
          <DialogDescription className="text-left">
            Enter the address for the bank account your Stripe payouts will be
            sent to. You will be redirected to Stripe to finish linking your
            account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Country</Label>
                  <CustomSelectCountry
                    value={field.value}
                    onChange={(val: unknown) => {
                      const typedVal = val as { value: string };
                      field.onChange(typedVal.value);
                    }}
                  />
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">State / Province</Label>
                  <TextField placeholder="Dublin" {...field} />
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">City</Label>
                  <TextField placeholder="Lagos" {...field} />
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">
                    Zip code / Postal code
                  </Label>
                  <TextField placeholder="505121" {...field} />
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Address</Label>
                  <TextField placeholder="24 Dublin Ireland" {...field} />
                  <FormMessage />
                </div>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#EAAA08] hover:bg-[#EAAA08]/90 text-white font-semibold"
                disabled={isPending}
              >
                {isPending ? "Continuing..." : "Continue to Stripe"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkStripeAddressDialog;
