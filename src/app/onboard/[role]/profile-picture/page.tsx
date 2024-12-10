import ProfilePhotoPicker from "@/components/custom/ProfilePhotoPicker";
import OnboardActionButtons from "@/section/onboard/ActionButtons";
import React from "react";

const OnboardProfilePicturePage = async () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center">
        <ProfilePhotoPicker />
        <div className="text-center mt-8">
          <h2 className="font-semibold text-lg mb-2.5">{"John Doe"}</h2>
          <p className="text-md">
            Your user tag is:{" "}
            <span className="font-semibold">{"johndoe123"}</span>
          </p>
        </div>
      </div>
      <OnboardActionButtons skipHref="/onboard/congratulations" />
    </div>
  );
};

export default OnboardProfilePicturePage;
