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
import { UK_SIZE_CHART_FEMALE, UK_SIZE_CHART_MALE } from "@/constant";
import { UmojaLinnSizingTemplate } from "@/types/project";

type UKSizeChartModalProps = {
  children: React.ReactNode;
  gender: UmojaLinnSizingTemplate["gender"]
};



const UKSizeChartModal = ({ children, gender }: UKSizeChartModalProps) => {
  const [open, setOpen] = useState(false);

  const chartData = gender === "MALE" ? UK_SIZE_CHART_MALE : UK_SIZE_CHART_FEMALE;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>UK Size Chart</DialogTitle>
          <DialogDescription>
            Use this chart to find the closest UK size. This is
            just a guide — the designer will request your exact measurements soon and use
            those to create your outfit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Table Header */}
          <div className="grid border-b-none border border-gray-300  grid-cols-5 gap-0">
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary-600 text-center border border-gray-300 ">
              UK Size
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary-600  text-center border border-gray-300 ">
              US Size
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary-600  text-center border border-gray-300 ">
              EU Size
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary-600 text-center border border-gray-300 ">
              FR Size
            </div>
            <div className="px-3 py-2 text-xs font-semibold text-white bg-primary-600 text-center border border-gray-300 ">
              Letter Size
            </div>
          </div>

          {/* Table Rows */}
          <div className="border border-gray-300">
            {chartData.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-5 gap-0 ",
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                )}
              >
                <div className="px-3 py-3 text-sm text-center border border-gray-300 ">{row.ukSize}</div>
                <div className="px-3 py-3 text-sm text-center border border-gray-300 ">{row.usSize}</div>
                <div className="px-3 py-3 text-sm text-center border border-gray-300 ">{row.euSize}</div>
                <div className="px-3 py-3 text-sm text-center border border-gray-300 ">{row.frSize}</div>
                <div className="px-3 py-3 text-sm text-center font-medium border border-gray-300 ">
                  {row.letterSize}
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

