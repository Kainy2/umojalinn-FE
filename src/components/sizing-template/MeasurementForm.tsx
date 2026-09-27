"use client";
/**
 * MeasurementForm - Main form for buyers to create/edit sizing templates.
 * Handles CREATE, EDIT, and VIEW-ONLY modes with proper field locking.
 */

import React from "react";
import UnitSelector from "./UnitSelector";
import MeasurementPointRow from "./MeasurementPointRow";
import BasicInfoFields from "./BasicInfoFields";
import { UmojaLinnSizingTemplate } from "@/types/project";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
} from "@/types/project";
import { cn } from "@/lib/utils";

type TemplateItem = {
  name: string;
  prop:
    | string
    | keyof (
        | UmojaLinnFemaleSizingTemplateProps
        | UmojaLinnMaleSizingTemplateProps
      );
  img: string;
};

type MeasurementFormProps = {
  name: string;
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  template: TemplateItem[];
  value: Partial<
    UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
  >;
  highlighted: string | null;
  sizingTemplateResult?: {
    metadata?: { reviews?: Partial<Record<string, string>> };
    submittedMeasurementPoints?: string[];
    requestedMeasurementPoints?: string[];
    defaultFieldsLocked?: boolean;
  };
  recommendationMode?: boolean;
  reviewsEdit?: Partial<
    Record<
      keyof (
        | UmojaLinnFemaleSizingTemplateProps
        | UmojaLinnMaleSizingTemplateProps
      ),
      string
    >
  >;
  modalType: "EDIT" | "RECOMMEND" | "VIEW-ONLY";
  onGenderChange: (value: UmojaLinnSizingTemplate["gender"]) => void;
  onUnitChange: (value: UmojaLinnSizingTemplate["unit"]) => void;
  onValueChange: (
    prop:
      | string
      | keyof (
          | UmojaLinnFemaleSizingTemplateProps
          | UmojaLinnMaleSizingTemplateProps
        ),
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementClick: (
    img: string,
    prop:
      | string
      | keyof (
          | UmojaLinnFemaleSizingTemplateProps
          | UmojaLinnMaleSizingTemplateProps
        ),
  ) => void;
  onKeyPress: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onHeightAndSizeChange?: (height: number, ukSize: string) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  className?: string;
};

const MeasurementForm = ({
  name,
  gender,
  unit,
  template,
  value,
  highlighted,
  sizingTemplateResult,
  recommendationMode = false,
  reviewsEdit,
  modalType,
  onUnitChange,
  onValueChange,
  onMeasurementClick,
  onKeyPress,
  onHeightAndSizeChange,
  inputRefs,
  className,
}: MeasurementFormProps) => {
  const isEditable = modalType === "EDIT";
  const areDefaultFieldsLocked =
    sizingTemplateResult?.defaultFieldsLocked ?? false;
  // const submittedPoints = sizingTemplateResult?.submittedMeasurementPoints ?? [];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="animate-in fade-in duration-300">
        <h2 className="text-xl font-bold text-foreground-body mb-6">
          {name || "Project Name"}
        </h2>
        <div className="flex justify-between sm:flex-row gap-4 items-center mb-6">
          <h3 className="text-md font-semibold text-foreground-body">Units</h3>
          <UnitSelector
            unit={unit}
            onChange={onUnitChange}
            disabled={!isEditable && areDefaultFieldsLocked}
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-b border-gray-200 pb-2 animate-in fade-in duration-300 delay-100">
        <span className="font-medium">Measurement Point</span>
        <span className="font-medium">Measurement</span>
      </div>

      {/* Measurement Points */}
      <div className="flex flex-col gap-2">
        <BasicInfoFields
          gender={gender}
          unit={unit}
          height={value?.height ?? 0}
          ukStandardSize={value?.ukStandardSize ?? null}
          onHeightAndSizeChange={onHeightAndSizeChange}
          disabled={!isEditable || areDefaultFieldsLocked}
        />

        {template
          .filter((item) => item.prop !== "height")
          .map((templateItem, index) => {
            const isNotEdit = modalType !== "EDIT";
            const reviewValue =
              (recommendationMode
                ? reviewsEdit?.[templateItem.prop as keyof typeof reviewsEdit]
                : undefined) ??
              sizingTemplateResult?.metadata?.reviews?.[
                templateItem.prop as string
              ];
            // const isSubmitted = submittedPoints.includes(templateItem.prop);

            return (
              <MeasurementPointRow
                key={templateItem.prop}
                disabled={isNotEdit && !reviewValue}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={onValueChange(templateItem.prop as any)}
                value={
                  (value?.[templateItem.prop as keyof typeof value] ??
                    0) as number
                }
                unit={unit}
                label={templateItem.name}
                onFocus={() =>
                  onMeasurementClick(
                    templateItem.img,
                    templateItem.prop as string,
                  )
                }
                highlighted={highlighted === templateItem.prop}
                hasLiveProject={false}
                metadata={{ review: reviewValue, img: templateItem?.img }}
                onClick={() => {
                  onMeasurementClick(
                    templateItem.img,
                    templateItem.prop as string,
                  );
                }}
                onKeyDown={(e) => onKeyPress(index, e)}
                // isSubmitted={isSubmitted}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MeasurementForm;
