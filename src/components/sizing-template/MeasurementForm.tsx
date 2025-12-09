"use client";
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
  prop: string | keyof (
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
    metadata?: {
      reviews?: Partial<
        Record<string, string>
      >;
    };
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
    prop: string | keyof (
      | UmojaLinnFemaleSizingTemplateProps
      | UmojaLinnMaleSizingTemplateProps
    )
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementClick: (
    img: string,
    prop: string | keyof (
      | UmojaLinnFemaleSizingTemplateProps
      | UmojaLinnMaleSizingTemplateProps
    )
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

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground-body mb-6">
          {name || "Project Name"}
        </h2>

        {/* Header Controls: Gender, Full-body, Unit */}
        <div className="flex justify-between sm:flex-row gap-4 items-center mb-6">
          {/* <GenderSelector
            gender={gender}
            onChange={(value) =>
              onGenderChange(value as UmojaLinnSizingTemplate["gender"])
            }
            disabled={!isEditable}
          /> */}
          {/* <FullBodyTab /> */}
          <h3 className="text-md font-semibold text-foreground-body">Units</h3>

          <UnitSelector
            unit={unit}
            onChange={onUnitChange}
            disabled={!isEditable}
          />
        </div>

      </div>

      {/* Measurement Points List */}
      <div className="flex flex-col gap-2">
        {/* Basic Info Fields: Male, UK Standard Size, Height */}
        <BasicInfoFields
          gender={gender}
          unit={unit}
          height={value?.height||50}
          ukStandardSize={"37ft"} // TODO: Get from API if available
          onHeightAndSizeChange={onHeightAndSizeChange}
          disabled={!isEditable}
        />

        {template.map((templateItem, index) => {
          const isNotEdit = modalType !== "EDIT";
          const reviewValue =
            (recommendationMode
              ? reviewsEdit?.[templateItem.prop as keyof typeof reviewsEdit]
              : undefined) ??
            sizingTemplateResult?.metadata?.reviews?.[templateItem.prop as string];

          return (
            <MeasurementPointRow
              key={templateItem.prop}
              disabled={isNotEdit && !reviewValue}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={onValueChange(templateItem.prop as any)}
              value={(value?.[templateItem.prop as keyof typeof value] ?? 0) as number}
              unit={unit}
              label={templateItem.name}
              onFocus={() => onMeasurementClick(templateItem.img, templateItem.prop as string)}
              highlighted={highlighted === templateItem.prop}
              hasLiveProject={false}
              metadata={{
                review: reviewValue,
                img: templateItem?.img,
              }}
              onClick={() => {
                onMeasurementClick(templateItem.img, templateItem.prop as string);
              }}
              onKeyDown={(e) => onKeyPress(index, e)}
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
