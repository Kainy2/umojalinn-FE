"use client";
/**
 * BasicInfoFields - Default fields (Gender, UK Size, Height) shown at top of form.
 * These are required before attaching template to a job and locked when project is active.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import HeightAndSizeModal from "./HeightAndSizeModal";
import { HelpCircle } from "lucide-react";

type BasicInfoFieldsProps = {
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  height: number;
  ukStandardSize: UmojalinnStandardSize | null;
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
    <div className={cn("flex flex-col gap-2", className)}>
      <HeightAndSizeModal height={height ?? 0} ukSize={ukStandardSize} unit={unit} onSubmit={handleSubmit} disabled={disabled} gender={gender}>
        <MeasurementItem label={gender} disabled={disabled} index={0} />
      </HeightAndSizeModal>

      <HeightAndSizeModal height={height ?? 0} ukSize={ukStandardSize} unit={unit} onSubmit={handleSubmit} disabled={disabled} gender={gender}>
        <MeasurementItem label="UK Standard Size" value={ukStandardSize ? `${ukStandardSize} UK` : undefined} disabled={disabled} showHelp index={1} />
      </HeightAndSizeModal>

      <HeightAndSizeModal height={height ?? 0} ukSize={ukStandardSize} unit={unit} onSubmit={handleSubmit} disabled={disabled} gender={gender}>
        <MeasurementItem label="Height" value={height ? `${height} ${unit}` : undefined} disabled={disabled} index={2} />
      </HeightAndSizeModal>
    </div>
  );
};

export default BasicInfoFields;

const MeasurementItem = ({
  label,
  value,
  disabled,
  showHelp,
  index = 0,
}: {
  label: string;
  value?: string | number;
  disabled?: boolean;
  showHelp?: boolean;
  index?: number;
}) => {
  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "flex flex-1 font-medium justify-between items-center p-3 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 text-sm",
        "animate-in fade-in slide-in-from-left-2",
        disabled ? "text-gray-400 border-gray-200 opacity-80 cursor-not-allowed" : "text-foreground-body hover:border-gray-300 hover:shadow-sm hover:scale-[1.01]"
      )}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {showHelp && <HelpCircle className="size-4 text-gray-400" />}
      </div>
      {value && <div className={cn("text-sm transition-colors", disabled ? "text-gray-400" : "text-gray-600")}>{value}</div>}
    </div>
  );
};
