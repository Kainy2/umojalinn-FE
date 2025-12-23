"use client";
/**
 * MeasurementGuide - Right panel showing measurement guide image and designer comments.
 */

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";

type MeasurementGuideProps = {
  previewImage: string | null;
  highlightedMeasurementName?: string;
  review?: string;
  className?: string;
};

const MeasurementGuide = ({
  previewImage,
  highlightedMeasurementName,
  review,
  className,
}: MeasurementGuideProps) => {
  if (!previewImage) {
    return (
      <div className={cn("hidden lg:flex flex-col gap-4 bg-gray-50 rounded-lg p-6 transition-all duration-300", className)}>
        <div className="flex-1 flex items-center justify-center text-muted-foreground min-h-[300px]">
          <p className="text-sm animate-pulse">Select a measurement point to see the guide</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("hidden lg:flex flex-col gap-4 bg-gray-50 rounded-lg p-6 transition-all duration-300", className)}>
      <div className="flex-1 relative min-h-[400px] bg-white rounded-lg overflow-hidden">
        {previewImage && (
          <Image src={previewImage} fill alt={`Guide for ${highlightedMeasurementName || "measurement"}`} className="object-contain animate-in fade-in duration-300" priority />
        )}
        {review && highlightedMeasurementName && (
          <div className="absolute top-4 left-4 right-4 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
            <RequestSizingTemplateViewCard title={highlightedMeasurementName} review={review} />
          </div>
        )}
      </div>
      
      {highlightedMeasurementName && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-sm font-semibold text-foreground-body mb-1">{highlightedMeasurementName}</p>
          <p className="text-xs text-muted-foreground">Measure around your body at this point, keeping the tape measure level and snug but not tight.</p>
        </div>
      )}
    </div>
  );
};

export default MeasurementGuide;
