"use client";
import React, { useState } from "react";
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
import { UmojaLinnSizingTemplate } from "@/types/project";
import { Minus, Plus } from "lucide-react";
import UKSizeChartModal from "./UKSizeChartModal";

const UK_SIZES = ["XXS", "XS", "S", "S-M", "M-L", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];

type HeightAndSizeModalProps = {
  children: React.ReactNode;
  height?: number | null;
  ukSize?: string;
  unit: UmojaLinnSizingTemplate["unit"];
  onSubmit: (height: number, ukSize: string) => void;
  disabled?: boolean;
};

const HeightAndSizeModal = ({
  children,
  height,
  ukSize,
  unit,
  onSubmit,
  disabled = false,
}: HeightAndSizeModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<"Ft" | "Cm">(unit === "INCH" ? "Ft" : "Cm");
  const [heightValue, setHeightValue] = useState(height || 5.9);
  const [selectedSize, setSelectedSize] = useState(ukSize || "XXS");

  const handleIncrement = () => {
    setHeightValue((prev) => Number((prev + 0.1).toFixed(1)));
  };

  const handleDecrement = () => {
    setHeightValue((prev) => Number(Math.max(0, prev - 0.1).toFixed(1)));
  };

  const handleSubmit = () => {
    onSubmit(heightValue, selectedSize);
    setOpen(false);
  };

  if (disabled) {
    return <>{children}</>;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
          {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[570px]">
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

            {/* Unit Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
              <button
                type="button"
                onClick={() => setSelectedUnit("Ft")}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  selectedUnit === "Ft"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Ft
              </button>
              <button
                type="button"
                onClick={() => setSelectedUnit("Cm")}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  selectedUnit === "Cm"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Cm
              </button>
            </div>

            {/* Height Input */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                className="size-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="size-5" />
              </button>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold">{heightValue}</span>
                <span className="text-lg text-gray-500">{selectedUnit}</span>
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="size-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </div>

          {/* UK Size Section */}
          <div>
            <label className="text-sm font-medium text-foreground-body mb-3 block">
              UK Size
            </label>

            {/* Size Grid */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {UK_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border rounded-lg transition-colors",
                    selectedSize === size
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* UK Size Chart Link */}
            <UKSizeChartModal>
              <button
                type="button"
                className="text-sm text-primary flex items-center gap-1"
              >
                <span className=" hover:underline">Unsure about your UK size?</span>
                <span className="text-lg">→</span>
              </button>
            </UKSizeChartModal>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
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

