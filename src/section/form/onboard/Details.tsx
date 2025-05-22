"use client";
import { CustomDatePickerField } from "@/components/custom/picker/Date";
import { CustomPhonePickerField } from "@/components/custom/picker/Phone";
import { CustomSelectField } from "@/components/custom/Select";
import { Form, FormField } from "@/components/ui/form";

// import useStorage from "@/hooks/useStorage";
import { onboardingDetailsFormSchema } from "@/lib/schema";

import OnboardActionButtons from "@/section/onboard/ActionButtons";
import { OnboardingProps } from "@/types/form";
import { UmojaLinnUserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const OnboardDetailsForm = (props: { role: UmojaLinnUserRole }) => {
  const router = useRouter();

  const nextUrl = `/onboard/${props.role?.toLocaleLowerCase()}/address`;

  const form = useForm<OnboardingProps["details"]>({
    resolver: zodResolver(onboardingDetailsFormSchema),
    defaultValues: {
      dateOfBirth: null,
      gender: "",
      phoneNumber: "",
    },
  });

  // const { getItem, setItem } = useStorage();
  const onboardMe: OnboardingProps["details"] = useMemo (() => sessionStorage.getItem("ONBOARD_INFO") ?? {}, []);

  useEffect(() => {
    if (Object.values(onboardMe)) {
      const formProps = ["gender", "dateOfBirth", "phoneNumber"] as const;
      formProps?.forEach((prop) => {
        if (onboardMe?.[prop]) {
          form?.setValue(prop, onboardMe?.[prop]);
        }
      });
    }
  }, [form, onboardMe]);

  async function onSubmit(values: OnboardingProps["details"]) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // setItem("ONBOARD_INFO", { ...onboardMe, ...values });

    const data = JSON.stringify(
      { ...onboardMe, ...values }
    )

    sessionStorage.setItem("ONBOARD_INFO", data);
    router.push(nextUrl);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
        autoComplete="off"
      >
        <div className="flex flex-col lg:flex-row gap-x-4 gap-y-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <CustomSelectField
                {...field}
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
                label="Gender"
                defaultValue={field.value}
                key={field.value}
                options={[
                  {
                    type: "option",
                    value: "MALE",
                    children: "Male",
                  },
                  {
                    type: "option",
                    value: "FEMALE",
                    children: "Female",
                  },
                  {
                    type: "option",
                    value: "RATHER_NOT_SAY",
                    children: "Rather not say",
                  },
                ]}
              />
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <CustomDatePickerField
                {...field}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                label="Date of birth"
              />
            )}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <CustomPhonePickerField
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                label="Phone number"
              />
            )}
          />
        </div>

        <OnboardActionButtons skipHref={nextUrl} />
      </form>
    </Form>
  );
};

export default OnboardDetailsForm;
