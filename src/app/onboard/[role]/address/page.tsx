import { CustomSelectField } from "@/components/custom/Select";
import TextField from "@/components/custom/TextField";
import OnboardActionButtons from "@/section/onboard/ActionButtons";
import React from "react";

const OnboardAddressPage = async ({
  params,
}: {
  params: Promise<{ role: string }>;
}) => {
  const { role } = await params;

  return (
    <div className="flex flex-col gap-8">
      <TextField label="Home address" />
      <CustomSelectField label="Country" />
      <TextField label="State" />
      <TextField label="City" />
      <TextField label="Zip code" />

      <OnboardActionButtons skipHref={`/onboard/${role}/profile-picture`} />
    </div>
  );
};

export default OnboardAddressPage;
