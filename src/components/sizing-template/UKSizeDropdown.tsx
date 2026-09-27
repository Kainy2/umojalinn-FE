"use client";

import { cn } from "@/lib/utils";
import { UmojalinnStandardSize } from "@/types/project";
import { MALE_STANDARD_SIZES, FEMALE_STANDARD_SIZES } from "@/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UKSizeDropdownProps {
  gender: "MALE" | "FEMALE";
  value: UmojalinnStandardSize | null;
  onChange: (value: UmojalinnStandardSize) => void;
  disabled?: boolean;
  className?: string;
}

export function UKSizeDropdown({
  gender,
  value,
  onChange,
  disabled = false,
  className,
}: UKSizeDropdownProps) {
  const sizes = gender === "MALE" ? MALE_STANDARD_SIZES : FEMALE_STANDARD_SIZES;
  const placeholder = gender === "MALE" ? "Select size (S, M, L...)" : "Select UK size (6, 8, 10...)";

  return (
    <>

      {disabled ? (<div>{value}</div>) : (<Select
        value={value ?? undefined}
        onValueChange={(val) => onChange(val as UmojalinnStandardSize)}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "w-[100px] h-8 text-sm bg-white border-gray-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {sizes.map((size) => (
            <SelectItem key={size} value={size} className="text-sm">
              {gender === "FEMALE" ? `UK ${size}` : size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>)
      }
    </>

  );
}

export default UKSizeDropdown;

