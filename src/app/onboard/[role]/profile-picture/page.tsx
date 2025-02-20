import OnboardProfilePhotoForm from "@/section/form/onboard/ProfilePhoto";
import { UmojaLinnUserRole } from "@/types/user";
import React from "react";

const OnboardProfilePicturePage = async ({
  params,
}: {
  params: Promise<{ role: UmojaLinnUserRole }>;
}) => {
  const { role } = await params;
  return <OnboardProfilePhotoForm role={role} />;
};

export default OnboardProfilePicturePage;
