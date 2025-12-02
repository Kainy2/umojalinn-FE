"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";

type BasicInfoFieldsProps = {
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  height?: number | null;
  ukStandardSize?: string;
  onGenderChange?: (gender: UmojaLinnSizingTemplate["gender"]) => void;
  onHeightChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUkStandardSizeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
};

const BasicInfoFields = ({
  gender,
  unit,
  height,
  ukStandardSize,
  disabled = false,
  className,
}: BasicInfoFieldsProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <MeasurementItem
        label={gender}
        disabled={disabled}
      />

      <MeasurementItem
        label={"UK Standard Size"}
        value={ukStandardSize}
        disabled={disabled}
      />

      <MeasurementItem
        label="Height"
        value={(height??'-')+" "+unit}
        disabled={disabled}
      />
    </div>
  );
};

export default BasicInfoFields;

const MeasurementItem = ({
  label,
  value,
  disabled,
}:{
  label: string;
  value?: string | number;
  disabled?: boolean;
})=>{
  return (
    <div className={cn(
      "flex flex-1 font-medium justify-between items-center p-3 rounded-lg transition-all cursor-pointer border border-gray-200 text-sm ",
      disabled ? "text-gray-400 border-gray-200 opacity-80" : "text-foreground-body hover:border-gray-300" 
    )}>
      <div className="text-right pr-10">{label}</div>

      {value && <div className={cn("text-xs")}>{value}</div>}
    </div>
  )
  
}
