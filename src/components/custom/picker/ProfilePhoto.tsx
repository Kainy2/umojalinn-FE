"use client";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD } from "@/constant";
import useFilePicker, { useFileSizeError } from "@/hooks/useFilePicker";
import { cn, jsonToFormData } from "@/lib/utils";
import { useGetMe, useUpdateUserDetails } from "@/tanstack/hooks/useUser";
import { Edit, Plus, User } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProfilePhotoPicker = (props: {
  small?: boolean;
  loading?: boolean;
  src?: string | null;
  edit?: boolean;
  onSelect?: (file: File | null) => void;
  controlled?: boolean;
  border?: boolean;
}) => {
  const { Input, onClick, previewUrl } = useFilePicker({
    onSelect: (file) => props.onSelect?.(file as File),
  });

  const url = props.controlled ? props.src : previewUrl;

  return (
    <button
      className={cn("relative rounded-full", props.loading && "opacity-70")}
      onClick={onClick}
      disabled={props.loading}
    >
      {url ? (
        <Image
          height={120}
          width={120}
          src={url}
          alt=""
          className={cn(
            "size-56 rounded-full object-cover object-center",
            props.small && "size-36",
            props.border && "border-4 border-white shadow-md shadow-gray-200/90"
          )}
        />
      ) : (
        <span
          className={cn(
            "flex items-center justify-center bg-gray-100 text-secondary-foreground size-56 rounded-full [&>svg]:size-30",
            props.small && "size-36 [&>svg]:size-16",
            props.border &&
              "border-4 border-white shadow-md shadow-gray-200/90",
            props.loading && "opacity-70"
          )}
        >
          <User />
        </span>
      )}
      {!props.loading && (
        <span
          className={cn(
            "absolute bottom-4 right-4 bg-white border border-dashed border-gray-300 p-2 rounded-xl shadow-lg shadow-gray-200/90 text-gray-400",
            props.edit && "text-primary",
            props.small && "bottom-0 right-0"
          )}
        >
          {props.edit ? <Edit /> : <Plus />}
        </span>
      )}
      <Input />
    </button>
  );
};

export const ProfilePhotoEdit = () => {
  const { data: dataMe, isFetching } = useGetMe();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateUserDetails();
  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD);

  return (
    <ProfilePhotoPicker
      small
      controlled
      src={dataMe?.data?.data?.profilePhotoUri}
      edit
      border
      loading={isFetching || isUpdating}
      onSelect={(file) => {
        if (file && isFileSizeValid(file))
          updateProfile(
            jsonToFormData({
              profileImage: file,
            })
          );
      }}
    />
  );
};

export default ProfilePhotoPicker;
