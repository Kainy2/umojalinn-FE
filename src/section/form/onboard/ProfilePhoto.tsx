"use client";
import ProfilePhotoPicker from "@/components/custom/picker/ProfilePhoto";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD } from "@/constant";
import { useFileSizeError } from "@/hooks/useFilePicker";
import useHandleError from "@/hooks/useHandleError";
// import useStorage from "@/hooks/useStorage";
import { jsonToFormData } from "@/lib/utils";
import OnboardActionButtons from "@/section/onboard/ActionButtons";
import { useGetMe, useOnboard } from "@/tanstack/hooks/useUser";
import { OnboardingProps } from "@/types/form";
import { UmojaLinnUserRole } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const OnboardProfilePhotoForm = (props: { role: UmojaLinnUserRole }) => {
  const { data } = useGetMe();

  const { update } = useSession();

  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD);

  const { mutateAsync: onboard, isPending: loading } = useOnboard({
    onSuccess: async () => {
      await update({
        user: {
          profileRole: props?.role?.toLocaleUpperCase?.(),
          hasOnboarded: true,
        },
      });
      sessionStorage.removeItem("ONBOARD_INFO");
      router.push("/onboard/congratulations");
    },
    onError: (error) => handleError(error),
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const { handleError } = useHandleError("Onboarding");

  const router = useRouter();

  const me = data?.data?.data;

  const { tag, firstName, lastName } = me || {};

  // const { getItem } = useStorage();
  const onboardMe: OnboardingProps["details"] = useMemo (() => sessionStorage.getItem("ONBOARD_INFO") ?? {}, []);

  const onSubmit = async () => {
    await onboard(
      jsonToFormData({
        ...onboardMe,
        profileImage: photo || undefined,
        profileType: props.role?.toLocaleUpperCase(),
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center">
        <ProfilePhotoPicker
          onSelect={(file) => {
            if (file && isFileSizeValid(file)) {
              return setPhoto(file);
            }
          }}
        />
        {!!tag && (
          <div className="text-center mt-8">
            <h2 className="font-semibold text-lg mb-2.5">
              {firstName} {lastName}
            </h2>
            <p className="text-md">
              Your user tag is: <span className="font-semibold">{tag}</span>
            </p>
          </div>
        )}
      </div>
      <OnboardActionButtons
        skipHref="/onboard/congratulations"
        loading={loading}
        onNextClick={onSubmit}
        hideSkip
      />
    </div>
  );
};

export default OnboardProfilePhotoForm;
