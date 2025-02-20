import OnboardDetailsForm from "@/section/form/onboard/Details";
import { UmojaLinnUserRole } from "@/types/user";
import React from "react";

const OnboardDetailsPage = async ({
  params,
}: {
  params: Promise<{ role: UmojaLinnUserRole }>;
}) => {
  const { role } = await params;

  return <OnboardDetailsForm role={role} />;
};

export default OnboardDetailsPage;
