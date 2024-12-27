"use client";
import useFilePicker from "@/hooks/useFilePicker";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProfilePhotoPicker = (props: {
  onSelect: (file: File | null) => void;
}) => {
  const { Input, onClick, previewUrl } = useFilePicker({
    onSelect: props.onSelect,
  });

  return (
    <button className="relative rounded-full" onClick={onClick}>
      {previewUrl ? (
        <Image
          height={120}
          width={120}
          src={previewUrl}
          alt=""
          className="h-56 w-56 rounded-full object-cover object-center"
        />
      ) : (
        <span className="flex items-center justify-center bg-slate-100 text-secondary-foreground h-56 w-56 rounded-full">
          <User size={120} />
        </span>
      )}
      <span className="absolute bottom-4 right-4 bg-white border border-dashed border-slate-300 p-2 rounded-xl shadow-lg shadow-slate-200/90 text-slate-400">
        <Plus />
      </span>
      <Input />
    </button>
  );
};

export default ProfilePhotoPicker;
