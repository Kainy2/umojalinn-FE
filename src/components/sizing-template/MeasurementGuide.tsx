"use client";
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
      <div
        className={cn(
          "hidden lg:flex flex-col gap-4 bg-gra-50 rounded-lg p-6",
          className
        )}
      >
        {/* <h3 className="text-lg font-semibold text-foreground-body">
          Measurement Guide
        </h3> */}
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a measurement point to see the guide</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col gap-4 bg-gra-50 rounded-lg p-6",
        className
      )}
    >
      {/* <h3 className="text-lg font-semibold text-foreground-body">
        Measurement Guide
      </h3> */}
      <div className="flex-1 relative min-h-[400px] bg-white rounded-lg overflow-hidden">
        {previewImage && (
          <Image
            src={previewImage}
            fill
            alt="Measurement guide"
            className="object-contain"
            priority
          />
        )}
        {review && highlightedMeasurementName && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <RequestSizingTemplateViewCard
              title={highlightedMeasurementName}
              review={review}
            />
          </div>
        )}
      </div>
      {highlightedMeasurementName && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-foreground-body mb-1">
            {highlightedMeasurementName}
          </p>
          <p className="text-xs text-muted-foreground">
            Click on the measurement point to see detailed instructions
          </p>
        </div>
      )}
    </div>
  );
};

export default MeasurementGuide;

