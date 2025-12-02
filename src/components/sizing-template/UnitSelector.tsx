"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";

type UnitSelectorProps = {
  unit: UmojaLinnSizingTemplate["unit"];
  onChange: (unit: UmojaLinnSizingTemplate["unit"]) => void;
  disabled?: boolean;
  className?: string;
};

const UnitSelector = ({
  unit,
  onChange,
  disabled = false,
  className,
}: UnitSelectorProps) => {
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
        onClick={() => onChange("CM")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          unit === "CM"
            ? "bg-primary text-white"
            : "text-gray-600 hover:text-gray-900",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        CM
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("INCH")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          unit === "INCH"
            ? "bg-primary text-white"
            : "text-gray-600 hover:text-gray-900",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        INCH
      </button>
    </div>
  );
};

export default UnitSelector;

