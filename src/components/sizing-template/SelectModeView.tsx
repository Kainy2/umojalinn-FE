"use client";
/**
 * SelectModeView - Designer interface to select measurement points to request from buyer.
 * Used when template is IN_USE but no measurement points have been requested yet.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import {
  UmojaLinnSizingTemplate,
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojalinnStandardSize,
} from "@/types/project";
import {
  useRequestMeasurementPoints,
  useRequestMeasurementPointsOnBid,
} from "@/tanstack/hooks/useSizingTemplates";
import UnitSelector from "./UnitSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "../ui/dialog";
import { FEMALE_SIZING_TEMPLATE, MALE_SIZING_TEMPLATE } from "@/constant/sizingTemplate";
import UKStandardSizeRow from "./UKStandardSizeRow";
import DisabledTemplateItems from "./DisabledTemplateItems";

type SelectModeViewProps = {
  projectId?: string;
  bidId?: string; // Optional bidId for bid-based API
  projectName?: string;
  buyerName?: string;
  gender: UmojaLinnSizingTemplate["gender"];
  unit: UmojaLinnSizingTemplate["unit"];
  ukStandardSize?: UmojalinnStandardSize | null;
  height?: number | null;
  template: Array<{ name: string; prop: string; img: string }>;
  hasTemplate?: boolean; // Whether a sizing template exists for this project
  onSuccess?: () => void;
  onUnitChange?: (unit: UmojaLinnSizingTemplate["unit"]) => void;
};

const SelectModeView = ({
  projectId,
  bidId,
  projectName,
  buyerName = "the buyer",
  gender,
  unit,
  ukStandardSize,
  height,
  template,
  hasTemplate = true,
  onSuccess,
  onUnitChange,
}: SelectModeViewProps) => {
  const defaultTemplate = gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(defaultTemplate[1].img);
  const [previewName, setPreviewName] = useState<string | null>(defaultTemplate[1].name);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  // Hook for template-based API (existing)
  const { mutate: requestPointsOnTemplate, isPending: isPendingTemplate } =
    useRequestMeasurementPoints({
      onSuccess: () => onSuccess?.(),
    });

  // Hook for bid-based API (new)
  const { mutate: requestPointsOnBid, isPending: isPendingBid } =
    useRequestMeasurementPointsOnBid({
      onSuccess: () => onSuccess?.(),
    });

  const isPending = isPendingTemplate || isPendingBid;

  const handleToggle = (prop: string) => {
    setSelectedPoints((prev) =>
      prev.includes(prop)
        ? prev.filter((point) => point !== prop)
        : [...prev, prop]
    );
  };

  const handleReset = () => setSelectedPoints([]);

  const handleSubmit = () => {
    // Check if template exists on project
    if (hasTemplate && projectId) {
      // Use template-based API (existing)
      requestPointsOnTemplate({
        projectId,
        requestedMeasurementPoints: selectedPoints,
      });
    } else if (bidId) {
      // Use bid-based API (new) - convert selectedPoints array to measurement object
      const measurements: Partial<
        UmojaLinnMaleSizingTemplateProps & UmojaLinnFemaleSizingTemplateProps
      > = {};

      // Convert selected point names to object with placeholder values
      // The backend expects field names as keys, but we only need to send the keys
      // The API will extract the field names from the keys that have values
      selectedPoints.forEach((pointProp) => {
        // Set a truthy value for each selected point
        // The backend extracts field names from keys that have values
        measurements[pointProp as keyof typeof measurements] = 1 as never;
      });

      requestPointsOnBid({
        bidId,
        measurements,
      });
    }
  };

  const handlePointHover = (img: string, name: string) => {
    setPreviewImage(img);
    setPreviewName(name);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Info Banner */}
        {/* <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground-body">Height and Standard Size!</p>
            <p className="text-sm text-muted-foreground">
              In the bidding phase, only Height and Standard size will be shown. Buyers can access
              other measurements once the project is live.
            </p>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="animate-in fade-in duration-300">
                <h1 className="text-lg font-bold text-foreground-body mb-2">
                  Request Sizing template
                </h1>
                <p className="text-sm text-muted-foreground">
                  Send measurements point to <b>&quot;{buyerName}&quot;</b>
                  {projectName && (
                    <>
                      {" "}
                      for <b>&quot;{projectName}&quot;</b> Project
                    </>
                  )}
                </p>
              </div>

              {/* Controls - Only show when template exists */}
              {hasTemplate && (
                <>
                  <div className="flex gap-4 items-start sm:items-center animate-in fade-in duration-300 delay-75">
                    {/* <GenderSelector gender={gender} disabled /> */}
                    <UnitSelector
                      unit={unit}
                      onChange={(onChangeUnit) => onUnitChange?.(onChangeUnit)}
                    />
                  </div>

                  {/* Default Fields (read-only) */}
                  <div className="flex flex-col gap-2 animate-in fade-in duration-300 delay-100">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium">{gender}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">UK Standard Size</span>
                        <HelpCircle className="size-4 text-gray-400" />
                      </div>
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
                </>
              )}

              <div className="flex flex-col gap-2 ">
              </div>

              {/* Measurement Points with Checkboxes */}
              <div className="flex flex-col gap-2">
                {!hasTemplate && (
                  <>
                    <DisabledTemplateItems title={gender} />
                    {/* <DisabledItems
                  title="Uk Standard Size"
                  value={ukStandardSize ?? "-"}
                /> */}
                    <UKStandardSizeRow
                      gender={gender}
                      value={ukStandardSize ?? null}
                      highlighted={false}
                      disabled
                      onChange={() => {}}
                      onShowChart={() => {}}
                    />
                    <DisabledTemplateItems
                      title="Height"
                      value={height ?? "-"}
                    />
                  </>
                )}

                {template
                  .filter((point) => point.name !== "Height")
                  .map((point, index) => {
                    const isSelected = selectedPoints.includes(point.prop);
                    return (
                      <div
                        key={point.prop}
                        onClick={() => handleToggle(point.prop)}
                        onMouseEnter={() =>
                          handlePointHover(point.img, point.name)
                        }
                        style={{ animationDelay: `${(index + 4) * 30}ms` }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-left-2",
                          isSelected
                            ? "bg-primary border-primary shadow-sm scale-[1.01]"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggle(point.prop)}
                            onClick={() => handleToggle(point.prop)}
                            className={cn(
                              "transition-all duration-200",
                              isSelected &&
                                "border-white bg-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              isSelected ? "text-white" : "text-foreground-body"
                            )}
                          >
                            {point.name}
                          </span>
                        </div>
                        <div
                          className="md:hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseEnter={(e) => e.stopPropagation()}
                          onMouseLeave={(e) => e.stopPropagation()}
                        >
                          <HelpCirclePreview
                            previewImage={previewImage || ""}
                            previewName={previewName || ""}
                            isSelected={isSelected}
                            open={
                              mobilePreviewOpen && previewName === point.name
                            }
                            onOpenChange={setMobilePreviewOpen}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex gap-3 mt-6 animate-in fade-in duration-300">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isPending || selectedPoints.length === 0}
                  className="flex-1 rounded-lg"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || selectedPoints.length === 0}
                  loading={isPending}
                  className="flex-1 rounded-lg"
                >
                  Request Sizing template
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="md:block hidden">
            <div className="sticky top-6 flex flex-col gap-4">
              {previewName && (
                <h3 className="text-lg font-semibold text-foreground-body animate-in fade-in duration-200">
                  {previewName}
                </h3>
              )}
              <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300">
                <div className="relative min-h-[400px] bg-white rounded-lg overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      fill
                      alt={`Guide for ${previewName || "measurement"}`}
                      className="object-contain animate-in fade-in duration-300"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-muted-foreground text-sm">
                      <p className="animate-pulse">
                        Hover over a measurement point to see the guide
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isPending || selectedPoints.length === 0}
                  className=" hover:scale-[1.02] transition-transform rounded-lg"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isPending || selectedPoints.length === 0}
                  loading={isPending}
                  className=" hover:scale-[1.02] transition-transform rounded-lg"
                >
                  Request Sizing template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModeView;

const HelpCirclePreview = ({
  previewImage,
  previewName,
  isSelected,
  open,
  onOpenChange,
}: {
  previewImage: string;
  previewName: string;
  isSelected: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <HelpCircle
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "size-4 transition-colors md:hidden",
            isSelected ? "text-white/70" : "text-gray-400"
          )}
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[570px] max-h-[80vh] h-[80vh] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle>Measurement Point Preview</DialogTitle>
          <DialogDescription>
            This is a preview of the measurement point.
          </DialogDescription>
          <Image
            src={previewImage}
            fill
            alt={`Guide for ${previewName || "measurement"}`}
            className="object-contain animate-in fade-in duration-300"
            priority
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};


// const DisabledItems = ({
//   title,
//   isHelpCircle = false,
//   value,
// }: {
//   title: string;
//   isHelpCircle?: boolean;
//   value?: string | number;
// }) => {
//   return (
//     <div
//       // style={{ animationDelay: `${(index + 4) * 30}ms` }}
//       className={cn(
//         "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-not-allowed group animate-in fade-in slide-in-from-left-2",
//         "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm opacity-50"
//       )}
//     >
//       <div className="flex items-center gap-3">
//         <span
//           className={cn(
//             "text-sm font-medium transition-colors",
//             "text-foreground-body"
//           )}
//         >
//           {title}
//         </span>
//       </div>
//       <div
//         className="md:hidden"
//         onClick={(e) => {
//           e.stopPropagation();
//         }}
//         onMouseEnter={(e) => e.stopPropagation()}
//         onMouseLeave={(e) => e.stopPropagation()}
//       >
//         {isHelpCircle &&
//         (<HelpCirclePreview
//           previewImage={""}
//           previewName={""}
//           isSelected={false}
//           open={false}
//           onOpenChange={()=>{}}
//         />)}
//       </div>
//       <div>
//         {value}
//       </div>
//     </div>
//   );
// };