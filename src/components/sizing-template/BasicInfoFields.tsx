"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";
import HeightAndSizeModal from "./HeightAndSizeModal";

type BasicInfoFieldsProps = {
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  height: number;
  ukStandardSize: number;
  onHeightAndSizeChange?: (height: number, ukSize: string) => void;
  disabled?: boolean;
  className?: string;
};

const BasicInfoFields = ({
  gender,
  unit,
  height,
  ukStandardSize,
  onHeightAndSizeChange,
  disabled = false,
  className,
}: BasicInfoFieldsProps) => {
  const handleSubmit = (newHeight: number, newUkSize: string) => {
    onHeightAndSizeChange?.(newHeight, newUkSize);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <HeightAndSizeModal
        height={height ?? 0}
        ukSize={ukStandardSize?.toString()}
        unit={unit}
        onSubmit={handleSubmit}
        disabled={disabled}
      >
        <MeasurementItem
          label={gender}
          disabled={disabled}
        />
      </HeightAndSizeModal>

      <HeightAndSizeModal
        height={height ?? 0}
        ukSize={ukStandardSize?.toString()}
        unit={unit}
        onSubmit={handleSubmit}
        disabled={disabled}
      >
        <MeasurementItem
          label={"UK Standard Size"}
          value={ukStandardSize?.toString()}
          disabled={disabled}
        />
      </HeightAndSizeModal>

      <HeightAndSizeModal
        height={height ?? 0}
        ukSize={ukStandardSize?.toString()}
        unit={unit}
        onSubmit={handleSubmit}
        disabled={disabled}
      >
        <MeasurementItem
          label="Height"
          value={(height ?? "-") + " " + unit}
          disabled={disabled}
        />
      </HeightAndSizeModal>
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
