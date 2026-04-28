"use client";
/**
 * UpdateModeView - Buyer interface to update fields that have designer recommendations.
 * Only fields with recommendations in metadata.reviews can be edited.
 */

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, MessageSquareText } from "lucide-react";
import {
  UmojaLinnSizingTemplate,
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
} from "@/types/project";
import { useSubmitMeasurementPoints } from "@/tanstack/hooks/useSizingTemplates";
import UnitSelector from "./UnitSelector";
import MeasurementGuide from "./MeasurementGuide";
import Image from "next/image";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FEMALE_SIZING_TEMPLATE,
  MALE_SIZING_TEMPLATE,
} from "@/constant/sizingTemplate";

type MeasurementValues = Partial<
  UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
>;
type ReviewsMap = Partial<Record<string, string>>;

type UpdateModeViewProps = {
  templateId: string;
  projectId: string;
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
  projectId,
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
  const defaultTemplate =
    gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE;

  const [values, setValues] = useState<MeasurementValues>(currentValues);
  const [highlighted, setHighlighted] = useState<string | null>(
    defaultTemplate[1].img,
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultTemplate[1].img,
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get fields that have recommendations
  const fieldsWithReviews = Object.keys(reviews).filter((key) => reviews[key]);

  // Get fields that are requested but have no value
  const fieldsWithMissingValues = requestedMeasurementPoints.filter(
    (prop) =>
      typeof currentValues[prop as keyof MeasurementValues] !== "number" ||
      currentValues[prop as keyof MeasurementValues] === 0,
  );
  const editableFields = Array.from(
    new Set([...fieldsWithReviews, ...fieldsWithMissingValues]),
  );

  // Filter template to show requested points with emphasis on those needing update
  const filteredTemplate = template
    .filter((item) => requestedMeasurementPoints.includes(item.prop))
    .sort((a, b) => {
      // Prioritize fields with reviews to appear at the top
      const aHasReview = !!reviews[a.prop as keyof ReviewsMap];
      const bHasReview = !!reviews[b.prop as keyof ReviewsMap];
      if (aHasReview && !bHasReview) return -1;
      if (!aHasReview && bHasReview) return 1;
      return 0;
    });

  // Sync with current values ONLY when the component mounts if values were somehow empty,
  // but generally avoid blindly syncing with currentValues to avoid wiping out user's unsaved inputs.
  useEffect(() => {
    if (
      Object.keys(values).length === 0 &&
      Object.keys(currentValues).length > 0
    ) {
      setValues(currentValues);
    }
  }, [currentValues]);

  // Handle unit conversion locally so inputs aren't cleared
  const prevUnitRef = useRef(unit);
  useEffect(() => {
    if (unit !== prevUnitRef.current) {
      const conversionFactor = prevUnitRef.current === "CM" ? 0.393701 : 2.54;
      setValues((prev) => {
        const newValue: MeasurementValues = { ...prev };
        Object.keys(newValue).forEach((key) => {
          const typedKey = key as keyof MeasurementValues;
          const currentValue = newValue[typedKey];
          if (typeof currentValue === "number") {
            const convertedValue = currentValue * conversionFactor;
            // @ts-expect-error dynamic assignment
            newValue[typedKey] = Number.isInteger(convertedValue)
              ? convertedValue
              : parseFloat(convertedValue.toFixed(2));
          }
        });
        return newValue;
      });
      prevUnitRef.current = unit;
    }
  }, [unit]);

  const { mutate: updateTemplate, isPending: isUpdating } =
    useSubmitMeasurementPoints(templateId, {
      onSuccess: () => onSuccess?.(),
    });

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      setValues((prev) => ({
        ...prev,
        [prop]: rawValue === "" ? undefined : Number(rawValue),
      }));
    };

  const handleKeyPress = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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
    // Only submit editable fields that were actually changed.
    const updatesToSubmit: Record<string, number> = {};

    editableFields.forEach((field) => {
      const nextValue = values[field as keyof MeasurementValues];
      const currentValue = currentValues[field as keyof MeasurementValues];
      const hasValidNextValue = typeof nextValue === "number" && nextValue > 0;
      const previousValue =
        typeof currentValue === "number" ? currentValue : undefined;
      const hasChanged = hasValidNextValue && nextValue !== previousValue;

      if (hasChanged) {
        updatesToSubmit[field] = nextValue;
      }
    });
    updateTemplate({ projectId, measurements: updatesToSubmit });
  };

  const hasAllEditableFieldsFilled = editableFields.every((field) => {
    const fieldValue = values[field as keyof MeasurementValues];
    return typeof fieldValue === "number" && fieldValue > 0;
  });

  const hasChangedEditableMeasurements = editableFields.some((field) => {
    const nextValue = values[field as keyof MeasurementValues];
    const currentValue = currentValues[field as keyof MeasurementValues];
    if (typeof nextValue !== "number" || nextValue <= 0) return false;
    return nextValue !== currentValue;
  });

  const disableSubmit =
    isUpdating ||
    editableFields.length === 0 ||
    !hasAllEditableFieldsFilled ||
    !hasChangedEditableMeasurements;

  const highlightedName =
    filteredTemplate.find((item) => item.prop === highlighted)?.name || "";
  const highlightedReview = highlighted ? reviews[highlighted] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Warning Banner */}
        <div className="mb-6 bg-error-50 border border-error-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="size-5 text-error-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground-body">
              Changes Requested
            </p>
            <p className="text-sm text-muted-foreground">
              Your designer has requested changes to some measurements. Fields
              highlighted in yellow need to be updated.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="animate-in fade-in duration-300">
                <h1 className="text-lg font-bold text-foreground-body mb-2">
                  {templateName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update the measurements your designer has flagged
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-in fade-in duration-300 delay-75">
                {/* <GenderSelector gender={gender} disabled /> */}
                <strong>Units</strong>
                <UnitSelector
                  unit={unit}
                  onChange={(onChangeUnit) => onUnitChange?.(onChangeUnit)}
                />
              </div>

              {/* Default Fields (read-only) */}
              <div className="flex flex-col gap-2 animate-in fade-in duration-300 delay-100">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">Gender</span>
                  {gender && (
                    <span className="text-muted-foreground">{gender}</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">UK Standard Size</span>
                  {ukStandardSize && (
                    <span className="text-muted-foreground">
                      {ukStandardSize}
                    </span>
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
                  const pointValue =
                    values[point.prop as keyof MeasurementValues];
                  const numericValue =
                    typeof pointValue === "number" ? pointValue : 0;
                  const isHighlighted = highlighted === point.prop;
                  const hasReview = fieldsWithReviews.includes(point.prop);
                  const isMissingValue = fieldsWithMissingValues.includes(
                    point.prop,
                  );
                  const canEdit = hasReview || isMissingValue;
                  // const isFilledReview = hasReview && numericValue > 0;

                  return (
                    <div key={point.prop} className="flex gap-3">
                      <div
                        onClick={() =>
                          handleMeasurementClick(point.img, point.prop)
                        }
                        style={{ animationDelay: `${(index + 3) * 30}ms` }}
                        className={cn(
                          "flex flex-1 items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2",
                          isHighlighted
                            ? "bg-primary border-primary shadow-sm scale-[1.01]"
                            : hasReview
                              ? "bg-white border-error-500 hover:border-error-600 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" // Red border for reviews
                              : canEdit
                                ? "bg-white border-error-300 hover:border-error-400"
                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              isHighlighted
                                ? "text-white"
                                : "text-foreground-body",
                            )}
                          >
                            {point.name}
                          </span>
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
                            placeholder="0"
                            disabled={!canEdit}
                            className={cn(
                              "w-20 text-right text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                              isHighlighted
                                ? "bg-white/10 text-white placeholder:text-white/50"
                                : "bg-white text-foreground-body border-none",
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs min-w-[40px]",
                              isHighlighted
                                ? "text-white/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {unit}
                          </span>
                        </div>
                      </div>

                      {hasReview && (
                        <div
                          className="border border-error-300 p-2 min-w- rounded-lg transition-all flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="lg:hidden">
                          <div className="lg:hidden">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  aria-label={`Open measurement guide for ${point.name}`}
                                  className="size-8 rounded-full bg-error-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                >
                                  <MessageSquareText className="size-4 text-error-500" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="w-[80vw] max-w-[425px] max-h-[80vh] h-[80vh]">
                                <div className="flex h-full min-h-0 w-full flex-col">
                                  <DialogTitle className="text-lg font-semibold mb-4 shrink-0">
                                    {point.name}
                                  </DialogTitle>
                                  <div className="relative min-h-0 flex-1">
                                    <Image
                                      src={point.img || ""}
                                      fill
                                      alt={`Guide for ${point.name}`}
                                      className="object-contain"
                                    />
                                    {!!reviews[point.prop] && (
                                      <RequestSizingTemplateViewCard
                                        className="absolute top-0"
                                        title={point.name}
                                        review={reviews[point.prop] || ""}
                                      />
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div
                            className="hidden size-8 rounded-full bg-error-50 lg:flex items-center justify-center"
                            aria-hidden
                          >
                            <MessageSquareText className="size-4 text-error-500" />
                          </div>
                          </div>
                          <div
                            className="hidden size-8 rounded-full bg-error-50 lg:flex items-center justify-center"
                            aria-hidden
                          >
                            <MessageSquareText className="size-4 text-error-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden mt-6 animate-in fade-in duration-300">
                <Button
                  onClick={handleSubmit}
                  disabled={disableSubmit}
                  loading={isUpdating}
                  className="w-full"
                >
                  Submit Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="sticky top-16">
              <MeasurementGuide
                previewImage={previewImage}
                highlightedMeasurementName={highlightedName}
                review={highlightedReview}
              />

              {/* Show review card if highlighted field has a review */}
              {/* {highlighted && highlightedReview && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <RequestSizingTemplateViewCard
                    title={highlightedName}
                    review={highlightedReview}
                  />
                </div>
              )} */}

              {/* Desktop Actions */}
              <div className="hidden lg:flex justify-end gap-2 -mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={handleSubmit}
                  disabled={disableSubmit}
                  loading={isUpdating}
                  className=" hover:scale-[1.02] transition-transform rounded-md bg-primary-600"
                >
                  Submit Changes
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
