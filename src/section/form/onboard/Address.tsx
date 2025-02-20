"use client";
import TextField from "@/components/custom/input/TextField";
import { Form, FormField } from "@/components/ui/form";

import { onboardingAddressFormSchema } from "@/lib/schema";

import OnboardActionButtons from "@/section/onboard/ActionButtons";
import { OnboardingProps } from "@/types/form";
import { UmojaLinnUserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import useStorage from "@/hooks/useStorage";
import CustomSelectCountry from "@/components/custom/SelectCountry";

const OnboardAddressForm = (props: { role: UmojaLinnUserRole }) => {
  const router = useRouter();

  const nextUrl = `/onboard/${props.role?.toLocaleLowerCase()}/profile-picture`;

  const form = useForm<OnboardingProps["address"]>({
    resolver: zodResolver(onboardingAddressFormSchema),
    defaultValues: {
      country: "",
      address: "",
      state: "",
      city: "",
      zipCode: "",
    },
  });

  const { getItem, setItem } = useStorage();
  const onboardMe = useMemo(() => getItem("ONBOARD_INFO") || {}, [getItem]);

  useEffect(() => {
    if (Object.values(onboardMe)) {
      const formProps = [
        "address",
        "country",
        "state",
        "city",
        "zipCode",
      ] as const;
      formProps?.forEach((prop) => {
        if (onboardMe?.address?.[prop]) {
          form?.setValue(prop, onboardMe?.address?.[prop] as string);
        }
      });
    }
  }, [form, onboardMe]);

  async function onSubmit(values: OnboardingProps["address"]) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setItem("ONBOARD_INFO", { ...onboardMe, address: { ...values } });
    router.push(nextUrl);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => <TextField {...field} label="Home address" />}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <CustomSelectCountry
              {...field}
              value={field.value}
              defaultValue={field.value}
              onValueChange={(val) => field.onChange(val)}
              label="Country"
            />
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => <TextField {...field} label="State" />}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => <TextField {...field} label="City" />}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => <TextField {...field} label="Zip Code" />}
        />

        <OnboardActionButtons skipHref={nextUrl} />
      </form>
    </Form>
  );
};

export default OnboardAddressForm;
