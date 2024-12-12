"use client";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const ProfilePhotoPicker = (props: {
  onSelect: (file: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    props.onSelect(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <button
      className="relative rounded-full"
      onClick={() => inputRef.current?.click?.()}
    >
      {preview ? (
        <Image
          height={120}
          width={120}
          src={preview}
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
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </button>
  );
};

export default ProfilePhotoPicker;
