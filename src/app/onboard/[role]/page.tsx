import CustomCheckbox from "@/components/custom/Checkbox";
import { CustomDatePickerField } from "@/components/custom/DatePicker";
import { CustomPhonePickerField } from "@/components/custom/PhonePicker";
import { CustomSelectField } from "@/components/custom/Select";
import OnboardActionButtons from "@/section/onboard/ActionButtons";
import Link from "next/link";
import React from "react";

const OnboardDetailsPage = async ({ params }: { params: { role: string } }) => {
  const { role } = await params;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-x-4 gap-y-8">
        <CustomSelectField
          label="Gender"
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
        <CustomDatePickerField label="Date of birth" />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <CustomPhonePickerField label="Phone number" />
      </div>
      <CustomCheckbox
        label={{
          children: (
            <>
              You agree to our{" "}
              <Link href="/privacy-policy" className="underline">
                privacy policy
              </Link>
            </>
          ),
        }}
      />
      <OnboardActionButtons skipHref={`/onboard/${role}/address`} />
    </div>
  );
};

export default OnboardDetailsPage;
