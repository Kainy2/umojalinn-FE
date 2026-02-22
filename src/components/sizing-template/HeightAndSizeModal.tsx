"use client";
/**
 * HeightAndSizeModal - Modal for inputting height and UK standard size values.
 * Height can be edited manually or via increment/decrement buttons.
 * Units: CM or INCH only.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import { ArrowRight, Minus, Plus } from "lucide-react";
import UKSizeChartModal from "./UKSizeChartModal";
import { MALE_STANDARD_SIZES, FEMALE_STANDARD_SIZES } from "@/types/constants";

const getSizes = (gender: UmojaLinnSizingTemplate["gender"]) =>
  gender === "MALE" ? MALE_STANDARD_SIZES : FEMALE_STANDARD_SIZES;

const VALUE_INCREMENT = 10;
const VALUE_MIN = 0;

type HeightAndSizeModalProps = {
  children?: React.ReactNode;
  height?: number | null;
  ukSize?: UmojalinnStandardSize | null;
  unit: UmojaLinnSizingTemplate["unit"];
  onSubmit: (height: number, ukSize: UmojalinnStandardSize, unit: UmojaLinnSizingTemplate["unit"]) => void;
  disabled?: boolean;
  /** External control for opening the modal */
  triggerOpen?: boolean;
  /** Callback for when modal open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Loading state for submit button */
  isLoading?: boolean;
  gender?: UmojaLinnSizingTemplate["gender"] | null;
};

const HeightAndSizeModal = ({
  children,
  height,
  ukSize: ukSizeProp,
  unit,
  onSubmit,
  disabled = false,
  triggerOpen,
  onOpenChange,
  isLoading = false,
  gender: genderProp,
}: HeightAndSizeModalProps) => {
  const gender = genderProp || "MALE";
  const ukSize = ukSizeProp ?? getSizes(gender)[0];

  const [open, setOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<"Inch" | "Cm">(unit === "INCH" ? "Inch" : "Cm");
  const [heightValue, setHeightValue] = useState(height ?? VALUE_MIN);
  const [selectedSize, setSelectedSize] = useState(ukSize);

  // Sync with external trigger
  useEffect(() => {
    if (triggerOpen !== undefined) {
      setOpen(triggerOpen);
    }
  }, [triggerOpen]);

  // Reset values when modal opens with new data
  useEffect(() => {
    if (open) {
      setHeightValue(height ?? 0);
      setSelectedSize(ukSize);
      setSelectedUnit(unit === "INCH" ? "Inch" : "Cm");
    }
  }, [open, height, ukSize, unit]);

  const handleOpenChange = (newOpen: boolean) => {
    // Don't allow closing while loading
    if (isLoading && !newOpen) return;
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleIncrement = () => {
    setHeightValue((prev) => Number((prev + VALUE_INCREMENT).toFixed(1)));
  };

  const handleDecrement = () => {
    setHeightValue((prev) => Number(Math.max(VALUE_MIN, prev - VALUE_INCREMENT).toFixed(1)));
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= VALUE_MIN) {
      setHeightValue(Number(value.toFixed(1)));
    } else if (e.target.value === "") {
      setHeightValue(VALUE_MIN);
    }
  };

  const handleSubmit = () => {
    // Just call onSubmit - modal closing is controlled externally via onOpenChange
    onSubmit(heightValue, selectedSize, selectedUnit === "Inch" ? "INCH" : "CM");
  };

  if (disabled && children) {
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[570px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle>Add your Height and Standard size</DialogTitle>
          <DialogDescription>
            This is just a guide — the designer will request your exact measurements
            soon and use those to create your outfit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Height Section */}
          <div>
            <label className="text-sm font-medium text-foreground-body mb-3 block">
              Height
            </label>

            {/* Unit Toggle - CM or INCH */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
              <button
                type="button"
                onClick={() => setSelectedUnit("Inch")}
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  selectedUnit === "Inch"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Inch
              </button>
              <button
                type="button"
                onClick={() => setSelectedUnit("Cm")}
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  selectedUnit === "Cm"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Cm
              </button>
            </div>

            {/* Height Input - Editable */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isLoading}
                className="size-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Minus className="size-5" />
              </button>
              <div className="flex items-baseline gap-1 relative">
                <input
                  type="number"
                  value={heightValue.toString()}
                  onChange={handleHeightInputChange}
                  disabled={isLoading}
                  step="0.1"
                  min="0"
                  className="text-5xl self-start font-semibold w-24 text-center bg-transparent border-b-2 border-gray-200 focus:border-primary focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-subtitle-1 text-gray-500">{selectedUnit}</span>
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isLoading}
                className="size-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </div>

          {/* UK Size Section */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground-body mb-3 block">
                UK Size
              </label>

              {/* UK Size Chart Link */}
              <UKSizeChartModal gender={gender}>
                <button
                  type="button"
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <span className="hover:underline">Unsure about your UK size?</span>
                  <span className="text-md"><ArrowRight className="size-4" /></span>
                </button>
              </UKSizeChartModal>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {getSizes(gender).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  disabled={isLoading}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-200 disabled:opacity-50",
                    selectedSize === size
                      ? "bg-primary text-white border-primary scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:scale-102"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={isLoading}
            className="flex-1"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeightAndSizeModal;
