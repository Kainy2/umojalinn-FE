"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SizingTemplateDialogProps, useSizingTemplateDialog } from "@/hooks/use-sizing-template";
import MeasurementForm from "./MeasurementForm";
import MeasurementGuide from "./MeasurementGuide";
import SuccessMessage from "./SuccessMessage";
import ActionButtons from "./ActionButtons";
import TextAreaField from "@/components/custom/input/TextAreaField";
import VerifyDialog from "@/components/custom/dialog/Verify";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
import GenderSelector from "./GenderSelector";
import UnitSelector from "./UnitSelector";
import FullBodyTab from "./FullBodyTab";
import MeasurementPointRow from "./MeasurementPointRow";
import { UmojaLinnSizingTemplate } from "@/types/project";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
} from "@/types/project";

type BothGenderSizingTemplateProps = keyof (UmojaLinnFemaleSizingTemplateProps | UmojaLinnMaleSizingTemplateProps)
type SizingTemplatePageProps = Omit<SizingTemplateDialogProps, "children">;

const SizingTemplatePage = (props: SizingTemplatePageProps) => {
  const router = useRouter();
  const {
    loading,
    highlightedSizingName,
    handleReviewsEditChange,
    handleChange,
    handleSubmit: originalHandleSubmit,
    sizingTemplateResult,
    reviewsEdit,
    isDraft,
    TEMPLATE,
    name,
    gender,
    unit,
    value,
    highlighted,
    setHighlighted,
    setGender,
    setUnit,
    handleChangeValuesByUnit,
    recommendationMode,
    openRequestChangesDialog,
    setOpenRequestChangesDialog,
    setRecommendationMode,
    loadingMe,
    isLoadingSizingTemplate,
    requestChangeOnSizingTemplate,
    handleKeyPress,
    previewImage,
    setPreviewImage,
    inputRefs,
    modalType,
  } = useSizingTemplateDialog({
    ...props,
    handleSuccess: (template) => {
      // Navigate back to sizing templates list after success
      router.push("/sizing-templates");
      props.handleSuccess?.(template);
    },
  });

  // Wrap handleSubmit to handle navigation
  const handleSubmit = (shouldGoLive?: true) => {
    originalHandleSubmit(shouldGoLive);
  };

  // LOADING STATE
  if (
    props?.id &&
    (isLoadingSizingTemplate || loadingMe || !sizingTemplateResult)
  ) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-[50vh]" />
      </div>
    );
  }

  const handleMeasurementClick = (
    img: string,
    prop: keyof (
      | UmojaLinnFemaleSizingTemplateProps
      | UmojaLinnMaleSizingTemplateProps
    )
  ) => {
    setPreviewImage(img);
    setHighlighted(prop);
  };

  const handleUnitChange = (newUnit: UmojaLinnSizingTemplate["unit"]) => {
    setUnit((prevUnit) => {
      handleChangeValuesByUnit(prevUnit, newUnit);
      return newUnit;
    });
  };

  const handleHeightAndSizeChange = (height: number, ukSize: string) => {
    // Update height value in the form
    const heightEvent = {
      target: { value: height.toString() }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange("height" as BothGenderSizingTemplateProps)(heightEvent);
    
    // TODO: Update UK size when backend supports it
    console.log("UK Size selected:", ukSize);
  };

  // Check if there are saved measurement points (for success message)
  const hasSavedMeasurements = sizingTemplateResult?.metadata?.reviews
    ? Object.values(sizingTemplateResult.metadata.reviews).some(Boolean)
    : false;

  // EDIT or VIEW-ONLY MODE (Buyer view)
  if (["VIEW-ONLY", "EDIT"].includes(modalType)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl">
          {/* Main Content Grid - 3:2 ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Measurement Form (3 parts) */}
            <div className="lg:col-span-3">
              
              <MeasurementForm
                name={name}
                gender={gender}
                unit={unit}
                template={TEMPLATE}
                value={value}
                highlighted={highlighted}
                sizingTemplateResult={sizingTemplateResult as {
                  metadata: { 
                    reviews?: Partial<Record<string, string>> | undefined; } | undefined
                }}
                modalType={modalType}
                onGenderChange={(value) =>
                  setGender(value as UmojaLinnSizingTemplate["gender"])
                }
                onUnitChange={handleUnitChange}
                onValueChange={(prop) => 
                  handleChange(prop as BothGenderSizingTemplateProps)}
                onMeasurementClick={(img, prop) => handleMeasurementClick(img, prop as BothGenderSizingTemplateProps)}
                onKeyPress={handleKeyPress}
                onHeightAndSizeChange={handleHeightAndSizeChange}
                inputRefs={inputRefs}
              />

              {/* Mobile Action Buttons */}
              <div className="lg:hidden mt-6">
                <ActionButtons
                  onSave={() => handleSubmit()}
                  onSubmit={() => handleSubmit(true)}
                  loading={loading}
                  showSave={
                    (modalType === "EDIT" ||
                      Object.values(
                        sizingTemplateResult?.metadata?.reviews ?? {}
                      ).some(Boolean)) &&
                    !props.disableSaving
                  }
                  showSubmit={isDraft || !props.id}
                />
              </div>
            </div>

            {/* Right Column - Measurement Guide (2 parts) */}
            <div className="lg:col-span-2">
                {/* Success Message */}
                {hasSavedMeasurements && (
                  <SuccessMessage />
                )}
              <div className="sticky top-16">

                <MeasurementGuide
                  previewImage={previewImage}
                  highlightedMeasurementName={highlightedSizingName}
                  review={
                    highlighted &&
                    sizingTemplateResult?.metadata?.reviews?.[highlighted]
                      ? sizingTemplateResult.metadata.reviews[highlighted]
                      : undefined
                  }
                  className=""
                />

                {/* Desktop Action Buttons */}
                <div className="hidden lg:block mt-6">
                  <ActionButtons
                    onSave={() => handleSubmit()}
                    onSubmit={() => handleSubmit(true)}
                    loading={loading}
                    showSave={
                      (modalType === "EDIT" ||
                        Object.values(
                          sizingTemplateResult?.metadata?.reviews ?? {}
                        ).some(Boolean)) &&
                      !props.disableSaving
                    }
                    showSubmit={isDraft || !props.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RECOMMEND MODE (Designer view)
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Recommendation Mode Banner */}
        {recommendationMode && (
          <div className="text-sm text-foreground-body bg-primary-50 border border-gray-200 mb-4 p-4 rounded-lg">
            <p className="font-bold mb-1">Recommendation mode</p>
            <p>
              Please choose the measurement point for which you would like to
              make recommended changes
            </p>
          </div>
        )}

        {/* Main Content Grid - 3:2 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Measurement Form (3 parts) */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6">
              {/* Header Section */}
              <div>
                <h1 className="text-2xl font-bold text-foreground-body mb-6">
                  {name}
                </h1>

                {/* Header Controls: Gender, Full-body, Unit */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                  <GenderSelector
                    gender={gender}
                    onChange={(value) =>
                      setGender(value as UmojaLinnSizingTemplate["gender"])
                    }
                    disabled
                  />
                  <FullBodyTab />
                  <UnitSelector
                    unit={unit}
                    onChange={handleUnitChange}
                  />
                </div>
              </div>

              {/* Measurement Points List */}
              <div className="flex flex-col gap-2">
                {TEMPLATE.map((templateItem, index) => (
                  <MeasurementPointRow
                    key={templateItem.prop}
                    disabled
                    onValueChange={handleChange(templateItem.prop)}
                    value={value?.[templateItem.prop] || 0}
                    unit={unit}
                    label={templateItem.name}
                    highlighted={highlighted === templateItem.prop}
                    metadata={{
                      review:
                        (recommendationMode
                          ? reviewsEdit?.[templateItem.prop]
                          : undefined) ||
                        sizingTemplateResult?.metadata?.reviews?.[
                          templateItem.prop
                        ],
                      img: templateItem?.img,
                    }}
                    onClick={() => {
                      handleMeasurementClick(
                        templateItem.img,
                        templateItem.prop as keyof (
                          | UmojaLinnFemaleSizingTemplateProps
                          | UmojaLinnMaleSizingTemplateProps
                        )
                      );
                    }}
                    onKeyDown={(e) => handleKeyPress(index, e)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>

              {/* Request Changes Dialog */}
              <VerifyDialog
                title="Request changes"
                description={highlightedSizingName}
                open={openRequestChangesDialog}
                onOpenChange={setOpenRequestChangesDialog}
                additionalComponent={
                  <TextAreaField
                    label="Your recommended changes"
                    value={highlighted ? reviewsEdit?.[highlighted] : ""}
                    onChange={handleReviewsEditChange(highlighted)}
                    maxLength={100}
                  />
                }
                pendingConfirm={false}
                fullWidthActions
                hideCancel
                confirmText="Submit changes"
              />
            </div>

            {/* Mobile Action Buttons */}
            {recommendationMode ? (
              <div className="lg:hidden mt-6">
                <ActionButtons
                  onSave={() => setOpenRequestChangesDialog(true)}
                  onSubmit={() => requestChangeOnSizingTemplate(reviewsEdit)}
                  loading={loading}
                  showSave={true}
                  showSubmit={true}
                  saveDisabled={!highlighted}
                />
              </div>
            ) : (
              <div className="lg:hidden mt-6">
                <Button
                  fullWidth
                  disabled={loading}
                  onClick={() => setRecommendationMode(true)}
                >
                  Recommendation mode
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Measurement Guide (2 parts) */}
          <div className="lg:col-span-2">
            <MeasurementGuide
              previewImage={previewImage}
              highlightedMeasurementName={highlightedSizingName}
              review={
                highlighted &&
                (reviewsEdit?.[highlighted] ||
                  sizingTemplateResult?.metadata?.reviews?.[highlighted])
                  ? reviewsEdit?.[highlighted] ||
                    sizingTemplateResult?.metadata?.reviews?.[highlighted] ||
                    ""
                  : undefined
              }
              className="sticky top-6"
            />

            {/* Desktop Action Buttons */}
            {recommendationMode ? (
              <div className="hidden lg:block mt-6">
                <ActionButtons
                  onSave={() => setOpenRequestChangesDialog(true)}
                  onSubmit={() => requestChangeOnSizingTemplate(reviewsEdit)}
                  loading={loading}
                  showSave={true}
                  showSubmit={true}
                  saveDisabled={!highlighted}
                />
              </div>
            ) : (
              <div className="hidden lg:block mt-6">
                <Button
                  disabled={loading}
                  onClick={() => setRecommendationMode(true)}
                  className="w-full"
                >
                  Recommendation mode
                </Button>
              </div>
            )}

            {/* Review Card Overlay */}
            {highlighted &&
              (reviewsEdit?.[highlighted] ||
                sizingTemplateResult?.metadata?.reviews?.[highlighted]) && (
                <div className="hidden lg:block mt-4">
                  <RequestSizingTemplateViewCard
                    title={highlightedSizingName}
                    review={
                      reviewsEdit?.[highlighted] ||
                      sizingTemplateResult?.metadata?.reviews?.[highlighted] ||
                      ""
                    }
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizingTemplatePage;

