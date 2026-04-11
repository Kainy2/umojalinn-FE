"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import UKSizeDropdown from "./UKSizeDropdown";
import UKSizeChartDrawer from "./UKSizeChartDrawer";

interface UKStandardSizeRowProps {
  gender: UmojaLinnSizingTemplate["gender"];
  value: UmojalinnStandardSize | null;
  onChange: (value: UmojalinnStandardSize) => void;
  onShowChart: () => void;
  highlighted?: boolean;
  disabled?: boolean;
  // isDesigner?: boolean;
  className?: string;

}

export function UKStandardSizeRow({
  gender,
  value,
  onChange,
  onShowChart,
  highlighted = false,
  disabled = false,
  // isDesigner = false,
  className,

}: UKStandardSizeRowProps) {
  const [isChartOpen, setIsChartOpen] = useState(false);

  const handleRowClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest('[role="combobox"]') || target.closest('[role="listbox"]')) {
      return;
    }
    onShowChart();
  };

  const handleHelpClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsChartOpen(true);
    onShowChart();
  };

  return (
    <>
      <div
        onClick={disabled ? undefined : handleRowClick}
        className={cn(
          "flex flex-1 font-medium justify-between items-center p-3 rounded-lg transition-all duration-200 cursor-pointer border text-sm",
          "animate-in fade-in slide-in-from-left-2",
          highlighted
            ? "bg-primary text-white border-primary"
            : disabled
              ? "text-gray-600 border-gray-200 opacity-80 cursor-not-allowed"
              : "text-foreground-body border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-[1.01]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className={highlighted ? "text-white" : ""}>UK Standard Size</span>
          <button
            onClick={handleHelpClick}
            className={cn(
              "p-0.5 rounded-full transition-colors",
              highlighted ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-600"
            )}
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="text-foreground-body">

          <UKSizeDropdown
            gender={gender}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              highlighted && "bg-white/10 border-white/30 text-white"
            )}
          />


        </div>
      </div>

      <UKSizeChartDrawer
        gender={gender}
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
      />
    </>
  );
}

export default UKStandardSizeRow;

