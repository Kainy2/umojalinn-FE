"use client";
import { CustomDatePickerField } from "@/components/custom/DatePicker";
import { CustomPhonePickerField } from "@/components/custom/PhonePicker";
import { CustomSelectField } from "@/components/custom/Select";
import { FormField } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import useHandleError from "@/hooks/useHandleError";
import { onboardingDetailsFormSchema } from "@/lib/schema";
import OnboardActionButtons from "@/section/onboard/ActionButtons";
import { OnboardingProps } from "@/types/form";
import { UmojaLinnUserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const OnboardDetailsForm = (props: { role: UmojaLinnUserRole }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();
  const { handleError } = useHandleError("Registration");
  const form = useForm<OnboardingProps["details"]>({
    resolver: zodResolver(onboardingDetailsFormSchema),
    defaultValues: {
      dateOfBirth: null,
      gender: "",
      phoneNumber: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(values: OnboardingProps["details"]) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    try {
      // await createAccount(values);
      // setItem("AUTH_REGISTER_EMAIL", { email: values?.email });
      setLoading(false);
      router.push("/register/verify");
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-x-4 gap-y-8">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <CustomSelectField
              {...field}
              label="Gender"
              value={field.value}
              onValueChange={(val) => field.onChange(val)}
              options={[
                {
                  type: "option",
                  value: "male",
                  children: "Male",
                },
                {
                  type: "option",
                  value: "female",
                  children: "Female",
                },
                {
                  type: "option",
                  value: "rather not say",
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
              value={field.value || undefined}
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

      <OnboardActionButtons
        loading={loading}
        skipHref={`/onboard/${props.role?.toLocaleLowerCase()}/address`}
      />
    </div>
  );
};

export default OnboardDetailsForm;
