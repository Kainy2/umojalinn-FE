"use client";
/**
 * UpdateModeView - Buyer interface to update fields that have designer recommendations.
 * Only fields with recommendations in metadata.reviews can be edited.
 */

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { UmojaLinnSizingTemplate, UmojaLinnFemaleSizingTemplateProps, UmojaLinnMaleSizingTemplateProps } from "@/types/project";
import { useUpdateSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";
import GenderSelector from "./GenderSelector";
import UnitSelector from "./UnitSelector";
import MeasurementGuide from "./MeasurementGuide";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";

type MeasurementValues = Partial<UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps>;
type ReviewsMap = Partial<Record<string, string>>;

type UpdateModeViewProps = {
  templateId: string;
  templateName: string;
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  ukStandardSize?: string | null;
  height?: number | null;
  reviews: ReviewsMap;
  requestedMeasurementPoints: string[];
  currentValues: MeasurementValues;
  template: Array<{ name: string; prop: string; img: string }>;
  onSuccess?: () => void;
  onUnitChange?: (unit: UmojaLinnSizingTemplate["unit"]) => void;
};

const UpdateModeView = ({
  templateId,
  templateName,
  gender,
  unit,
  ukStandardSize,
  height,
  reviews,
  requestedMeasurementPoints,
  currentValues,
  template,
  onSuccess,
  onUnitChange,
}: UpdateModeViewProps) => {
  const [values, setValues] = useState<MeasurementValues>(currentValues);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get fields that have recommendations
  const fieldsWithReviews = Object.keys(reviews).filter((key) => reviews[key]);

  // Filter template to show requested points with emphasis on those needing update
  const filteredTemplate = template.filter((item) =>
    requestedMeasurementPoints.includes(item.prop)
  );

  // Sync with current values when they change
  useEffect(() => {
    setValues(currentValues);
  }, [currentValues]);

  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateSizingTemplate(templateId, {
    onSuccess: () => onSuccess?.(),
  });

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value) || 0;
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

  const handleSubmit = () => {
    // Only submit fields that have reviews (the ones that can be edited)
    const updatesToSubmit: Record<string, number> = {};
    fieldsWithReviews.forEach((field) => {
      const value = values[field as keyof MeasurementValues];
      if (typeof value === "number") {
        updatesToSubmit[field] = value;
      }
    });
    updateTemplate(updatesToSubmit);
  };

  const highlightedName = filteredTemplate.find((item) => item.prop === highlighted)?.name || "";
  const highlightedReview = highlighted ? reviews[highlighted] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Warning Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground-body">Changes Requested</p>
            <p className="text-sm text-muted-foreground">
              Your designer has requested changes to some measurements. Fields highlighted in yellow
              need to be updated.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="animate-in fade-in duration-300">
                <h1 className="text-lg font-bold text-foreground-body mb-2">{templateName}</h1>
                <p className="text-sm text-muted-foreground">
                  Update the measurements your designer has flagged
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-in fade-in duration-300 delay-75">
                <GenderSelector gender={gender} disabled />
                <UnitSelector
                  unit={unit}
                  onChange={(onChangeUnit) => onUnitChange?.(onChangeUnit)} />
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

              {/* Measurement Points */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                  <span>Measurement Point</span>
                  <span>Measurement</span>
                </div>

                {filteredTemplate.map((point, index) => {
                  const pointValue = values[point.prop as keyof MeasurementValues];
                  const numericValue = typeof pointValue === "number" ? pointValue : 0;
                  const isHighlighted = highlighted === point.prop;
                  const hasReview = fieldsWithReviews.includes(point.prop);
                  const canEdit = hasReview;

                  return (
                    <div
                      key={point.prop}
                      onClick={() => handleMeasurementClick(point.img, point.prop)}
                      style={{ animationDelay: `${(index + 3) * 30}ms` }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2",
                        isHighlighted
                          ? "bg-primary border-primary shadow-sm scale-[1.01]"
                          : hasReview
                          ? "bg-amber-50 border-amber-300 hover:border-amber-400"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            isHighlighted
                              ? "text-white"
                              : hasReview
                              ? "text-amber-800"
                              : "text-foreground-body"
                          )}
                        >
                          {point.name}
                        </span>
                        {hasReview && !isHighlighted && (
                          <AlertTriangle className="size-4 text-amber-600" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={(element) => {
                            inputRefs.current[index] = element;
                          }}
                          type="number"
                          min={0}
                          max={999}
                          value={numericValue || ""}
                          onChange={handleChange(point.prop)}
                          onKeyDown={(event) => handleKeyPress(index, event)}
                          onClick={(event) => event.stopPropagation()}
                          placeholder="0"
                          disabled={!canEdit}
                          className={cn(
                            "w-20 text-right text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                            isHighlighted
                              ? "bg-white/10 text-white placeholder:text-white/50"
                              : canEdit
                              ? "bg-white text-foreground-body border border-amber-300"
                              : "bg-gray-100 text-muted-foreground cursor-not-allowed"
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
              <div className="lg:hidden mt-6 animate-in fade-in duration-300">
                <Button
                  onClick={handleSubmit}
                  disabled={isUpdating || fieldsWithReviews.length === 0}
                  loading={isUpdating}
                  className="w-full"
                >
                  Save Updates
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
                review={highlightedReview}
              />

              {/* Show review card if highlighted field has a review */}
              {highlighted && highlightedReview && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <RequestSizingTemplateViewCard
                    title={highlightedName}
                    review={highlightedReview}
                  />
                </div>
              )}

              {/* Desktop Actions */}
              <div className="hidden lg:block mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={handleSubmit}
                  disabled={isUpdating || fieldsWithReviews.length === 0}
                  loading={isUpdating}
                  className="w-full hover:scale-[1.02] transition-transform"
                >
                  Save Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModeView;

