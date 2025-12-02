"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";

type GenderSelectorProps = {
  gender: UmojaLinnSizingTemplate["gender"];
  onChange: (gender: UmojaLinnSizingTemplate["gender"]) => void;
  disabled?: boolean;
  className?: string;
};

const GenderSelector = ({
  gender,
  onChange,
  disabled = false,
  className,
}: GenderSelectorProps) => {
  return (
    <div
      className={cn(
        "flex gap-1 bg-gray-100 rounded-lg p-1",
        className
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("MALE")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          gender === "MALE"
            ? "bg-primary text-white"
            : "text-gray-600 hover:text-gray-900",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        Male
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("FEMALE")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          gender === "FEMALE"
            ? "bg-primary text-white"
            : "text-gray-600 hover:text-gray-900",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        Female
      </button>
    </div>
  );
};

export default GenderSelector;

