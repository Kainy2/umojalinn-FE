"use client";
import { Plus, User } from "lucide-react";
import React, { useRef } from "react";

const ProfilePhotoPicker = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      className="relative rounded-full"
      onClick={() => inputRef.current?.click?.()}
    >
      <span className="flex items-center justify-center bg-slate-100 text-secondary-foreground h-56 w-56 rounded-full">
        <User size={120} />
      </span>
      <span className="absolute bottom-4 right-4 bg-white border border-dashed border-slate-300 p-2 rounded-xl shadow-lg shadow-slate-200/90 text-slate-400">
        <Plus />
      </span>
      <input type="file" accept="image/*" className="hidden" ref={inputRef} />
    </button>
  );
};

export default ProfilePhotoPicker;
