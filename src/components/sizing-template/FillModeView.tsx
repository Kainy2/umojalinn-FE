"use client";
/**
 * FillModeView - Buyer interface to fill in requested measurement points.
 * Shows ONLY the measurement points requested by the designer.
 */

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn, removeNonDigits } from "@/lib/utils";
import { UmojaLinnSizingTemplate, UmojaLinnFemaleSizingTemplateProps, UmojaLinnMaleSizingTemplateProps, UmojalinnStandardSize } from "@/types/project";
import { useSubmitMeasurementPoints, useSaveMeasurementPoints } from "@/tanstack/hooks/useSizingTemplates";
import GenderSelector from "./GenderSelector";
import UnitSelector from "./UnitSelector";
import MeasurementGuide from "./MeasurementGuide";
import { FEMALE_SIZING_TEMPLATE, MALE_SIZING_TEMPLATE } from "@/constant/sizingTemplate";

type MeasurementValues = Partial<UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps>;

type FillModeViewProps = {
  templateId: string;
  projectId: string;  
  templateName: string;
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  ukStandardSize?: UmojalinnStandardSize | null;
  height?: number | null;
  requestedMeasurementPoints: string[];
  currentValues: MeasurementValues;
  template: Array<{ name: string; prop: string; img: string }>;
  onSuccess?: () => void;
  onUnitChange?: (unit: UmojaLinnSizingTemplate["unit"]) => void;
};

const FillModeView = ({
  templateId,
  projectId,
  templateName,
  gender,
  unit,
  ukStandardSize,
  height,
  requestedMeasurementPoints,
  currentValues,
  template,
  onSuccess,
  onUnitChange,
}: FillModeViewProps) => {
  const defaultTemplate = gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE

  const [values, setValues] = useState<MeasurementValues>(currentValues);
  const [highlighted, setHighlighted] = useState<string | null>(defaultTemplate[1].img);
  const [previewImage, setPreviewImage] = useState<string | null>(defaultTemplate[1].img);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Filter template to only show requested points
  const filteredTemplate = template.filter((item) =>
    requestedMeasurementPoints.includes(item.prop)
  );

  // Sync with current values when they change
  useEffect(() => {
    setValues(currentValues);
  }, [currentValues]);

  const { mutate: submitPoints, isPending: isSubmitting } = useSubmitMeasurementPoints(templateId, {
    onSuccess: () => onSuccess?.(),
  });

  const { mutate: savePoints, isPending: isSaving } = useSaveMeasurementPoints(templateId, {
    onSuccess: () => onSuccess?.(),
  });

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(removeNonDigits(event.target.value)) || 0;
    console.log(numValue);
    setValues((prev) => ({ ...prev, [prop]: numValue }));
  };

  const handleKeyPress = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const nextIndex = index + 1;
      if (nextIndex < filteredTemplate.length) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleMeasurementClick = (img: string, prop: string) => {
    setPreviewImage(img);
    setHighlighted(prop);
  };

  const handleSave = () => {
    // Only include requested measurement points
    const measurementsToSave: Record<string, number> = {};
    requestedMeasurementPoints.forEach((point) => {
      const value = values[point as keyof MeasurementValues];
      if (typeof value === "number") {
        measurementsToSave[point] = value;
      }
    });
    savePoints(measurementsToSave);
  };

  const handleSubmit = () => {
    // Only include requested measurement points
    const measurementsToSubmit: Record<string, number> = {};
    requestedMeasurementPoints.forEach((point) => {
      const value = values[point as keyof MeasurementValues];
      if (typeof value === "number") {
        measurementsToSubmit[point] = value;
      }
    });
    submitPoints({ projectId, measurements: measurementsToSubmit });
  };

  const isLoading = isSubmitting || isSaving;
  const highlightedName = filteredTemplate.find((item) => item.prop === highlighted)?.name || "";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="animate-in fade-in duration-300">
                <h1 className="text-lg font-bold text-foreground-body mb-2">{templateName}</h1>
                <p className="text-sm text-muted-foreground">
                  Fill in the measurement points requested by your designer
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-between gap-4 items-start sm:items-center animate-in fade-in duration-300 delay-75">
                <GenderSelector gender={gender} disabled />
                <UnitSelector
                  unit={unit}
                  onChange={(onChangeUnit) => onUnitChange?.(onChangeUnit)}
                />
              </div>

              {/* Default Fields (read-only) */}
              <div className="flex flex-col gap-2 animate-in fade-in duration-300 delay-100">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">UK Standard Size</span>
                  {ukStandardSize && (
                    <span className="text-muted-foreground">{ukStandardSize}</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">Height</span>
                  {height !== null && height !== undefined && (
                    <span className="text-muted-foreground">
                      {height} {unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Requested Measurement Points */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                  <span>Measurement Point</span>
                  <span>Measurement</span>
                </div>

                {filteredTemplate.map((point, index) => {
                  const pointValue = values[point.prop as keyof MeasurementValues];
                  const numericValue = typeof pointValue === "number" ? pointValue : 0;
                  const isHighlighted = highlighted === point.prop;

                  return (
                    <div
                      key={point.prop}
                      onClick={() => handleMeasurementClick(point.img, point.prop)}
                      style={{ animationDelay: `${(index + 3) * 30}ms` }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2",
                        isHighlighted
                          ? "bg-primary border-primary shadow-sm scale-[1.01]"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isHighlighted ? "text-white" : "text-foreground-body"
                        )}
                      >
                        {point.name}
                      </span>

                      <div className="flex items-center gap-2">
                        <input
                          ref={(element) => {
                            inputRefs.current[index] = element;
                          }}
                          type="number"
                          min={0}
                          max={999}
                          value={numericValue || ""}
                          onChange={e=>{console.log("val", e.target.value); handleChange(point.prop)(e)}}
                          onKeyDown={(event) => handleKeyPress(index, event)}
                          onClick={(event) => event.stopPropagation()}
                          placeholder="0"
                          className={cn(
                            "w-20 text-right text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                            isHighlighted
                              ? "bg-white/10 text-white placeholder:text-white/50"
                              : "bg-gray-50 text-foreground-body"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs min-w-[40px]",
                            isHighlighted ? "text-white/70" : "text-muted-foreground"
                          )}
                        >
                          {unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex gap-3 mt-6 animate-in fade-in duration-300">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isLoading}
                  loading={isSaving}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  loading={isSubmitting}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="sticky top-6">
              <MeasurementGuide
                previewImage={previewImage}
                highlightedMeasurementName={highlightedName}
              />

              {/* Desktop Actions */}
              <div className="hidden lg:flex flex-col gap-3 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isLoading}
                  loading={isSaving}
                  className="w-full hover:scale-[1.02] transition-transform"
                >
                  Save
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  loading={isSubmitting}
                  className="w-full hover:scale-[1.02] transition-transform"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillModeView;

