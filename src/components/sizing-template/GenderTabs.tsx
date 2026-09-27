"use client";

import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";

interface GenderTabsProps {
  gender: UmojaLinnSizingTemplate["gender"];
  onChange: (gender: UmojaLinnSizingTemplate["gender"]) => void;
  disabled?: boolean;
  className?: string;
}

export function GenderTabs({
  gender,
  onChange,
  disabled = false,
  className,
}: GenderTabsProps) {
  return (
    <div className={cn("flex", className)}>
      <button
        type="button"
        onClick={() => !disabled && onChange("MALE")}
        disabled={disabled}
        className={cn(
          "px-6 py-2 text-sm font-medium border-b-2 transition-all duration-200",
          "flex-1",
          gender === "MALE"
            ? "text-primary bg-white border-primary"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed hover:bg-transparent	"
        )}
      >
        Male
      </button>
      <button
        type="button"
        onClick={() => !disabled && onChange("FEMALE")}
        disabled={disabled}
        className={cn(
          "px-6 py-2 text-sm font-medium border-b-2 transition-all duration-200",
          "flex-1",
          gender === "FEMALE"
            ? "text-primary bg-white border-primary"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed hover:bg-transparent	"
        )}
      >
        Female
      </button>
    </div>
  );
}

export default GenderTabs;

