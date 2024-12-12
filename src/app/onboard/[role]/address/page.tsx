import OnboardAddressForm from "@/section/form/onboard/Address";
import { UmojaLinnUserRole } from "@/types/user";
import React from "react";

const OnboardAddressPage = async ({
  params,
}: {
  params: Promise<{ role: UmojaLinnUserRole }>;
}) => {
  const { role } = await params;

  return (
    <div className="flex flex-col gap-8">
      <OnboardAddressForm role={role} />
    </div>
  );
};

export default OnboardAddressPage;
