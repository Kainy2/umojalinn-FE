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
import { cn } from "@/lib/utils";

type UKSizeChartModalProps = {
  children: React.ReactNode;
};

const UK_SIZE_CHART_DATA = [
  { ukSize: "4", bust: "76", waist: "58", hips: "84", letter: "XXS" },
  { ukSize: "6", bust: "81", waist: "63", hips: "89", letter: "XS" },
  { ukSize: "8", bust: "86", waist: "68", hips: "94", letter: "S" },
  { ukSize: "10", bust: "91", waist: "73", hips: "99", letter: "M" },
  { ukSize: "12", bust: "97", waist: "79", hips: "105", letter: "L" },
  { ukSize: "14", bust: "102", waist: "84", hips: "110", letter: "XL" },
  { ukSize: "16", bust: "107", waist: "89", hips: "115", letter: "XXL" },
  { ukSize: "18", bust: "112", waist: "94", hips: "120", letter: "3XL" },
  { ukSize: "20", bust: "117", waist: "99", hips: "125", letter: "4XL" },
  { ukSize: "22", bust: "122", waist: "104", hips: "130", letter: "5XL" },
  { ukSize: "24", bust: "132", waist: "114", hips: "140", letter: "6XL" },
];

const UKSizeChartModal = ({ children }: UKSizeChartModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>UK Size Chart</DialogTitle>
          <DialogDescription>
            Use this chart to find the closest UK size which to your chest fit. This is
            just a guide — the designer will request your exact measurements soon and use
            those to create your outfit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary rounded-t-lg text-center">
              UK Size
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary rounded-t-lg text-center">
              UK Bust
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary rounded-t-lg text-center">
              UK Waist
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary rounded-t-lg text-center">
              UK Hips
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary rounded-t-lg text-center">
              Letter Size
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-1">
            {UK_SIZE_CHART_DATA.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-5 gap-2",
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                )}
              >
                <div className="px-3 py-3 text-sm text-center">{row.ukSize}</div>
                <div className="px-3 py-3 text-sm text-center">{row.bust}</div>
                <div className="px-3 py-3 text-sm text-center">{row.waist}</div>
                <div className="px-3 py-3 text-sm text-center">{row.hips}</div>
                <div className="px-3 py-3 text-sm text-center font-medium">
                  {row.letter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UKSizeChartModal;

