"use client";
/**
 * SizingTemplatePage - Main page for viewing/editing sizing templates.
 * Routes to different views based on templateMode:
 * - SELECT: Designer selects measurement points (IN_USE, no requested points)
 * - VIEW: Designer views template (read-only)
 * - RECOMMEND: Designer adds recommendations
 * - FILL: Buyer fills requested points
 * - UPDATE: Buyer updates from recommendations
 * - EDIT: Buyer full edit (draft/live)
 * - VIEW_ONLY: Read-only (in use, all submitted)
 */

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SizingTemplateDialogProps, useSizingTemplateDialog } from "@/hooks/use-sizing-template";
import { TEMPLATE_MODE } from "@/types/constants";
import MeasurementForm from "./MeasurementForm";
import MeasurementGuide from "./MeasurementGuide";
import SuccessMessage from "./SuccessMessage";
import ActionButtons from "./ActionButtons";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
import GenderSelector from "./GenderSelector";
import UnitSelector from "./UnitSelector";
import FullBodyTab from "./FullBodyTab";
import MeasurementPointRow from "./MeasurementPointRow";
import SavedMeasurementsNotice from "./SavedMeasurementsNotice";
import AddToJobDropdown from "./AddToJobDropdown";
import ReminderBanner from "./ReminderBanner";
import SelectModeView from "./SelectModeView";
import FillModeView from "./FillModeView";
import UpdateModeView from "./UpdateModeView";
import { UmojaLinnSizingTemplate } from "@/types/project";
import { UmojaLinnFemaleSizingTemplateProps, UmojaLinnMaleSizingTemplateProps } from "@/types/project";
import { canSendReminder, getRemainingReminderTime } from "@/lib/sizing-template-utils";
import { useSendSizingTemplateReminder } from "@/tanstack/hooks/useSizingTemplates";
import { useGetProjectById } from "@/tanstack/hooks/useProject";

type BothGenderSizingTemplateProps = keyof (UmojaLinnFemaleSizingTemplateProps | UmojaLinnMaleSizingTemplateProps);

type SizingTemplatePageProps = Omit<SizingTemplateDialogProps, "children"> & {
  projectId?: string;
};

const SizingTemplatePage = (props: SizingTemplatePageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const effectiveProjectId = props.projectId || urlProjectId || undefined;

  // Fetch project data if we have a project ID
  const { data: projectData } = useGetProjectById(effectiveProjectId);
  const project = projectData?.data?.data;
  
  const {
    loading,
    highlightedSizingName,
    handleChange,
    handleSubmit: originalHandleSubmit,
    sizingTemplateResult,
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
    setRecommendationMode,
    loadingMe,
    isLoadingSizingTemplate,
    requestChangeOnSizingTemplate,
    handleKeyPress,
    previewImage,
    setPreviewImage,
    inputRefs,
    modalType,
    templateMode,
    requestedMeasurementPoints,
    hasRequestedPoints,
    hasReviews,
  } = useSizingTemplateDialog({
    ...props,
    handleSuccess: (template) => {
      router.push("/sizing-templates");
      props.handleSuccess?.(template);
    },
  });

  // Designer recommendation mode state
  const [selectedMeasurements, setSelectedMeasurements] = React.useState<string[]>([]);
  const [measurementComments, setMeasurementComments] = React.useState<Record<string, string>>({});

  // Reminder mutation
  const { mutate: sendReminder } = useSendSizingTemplateReminder(sizingTemplateResult?.id || "");

  // Handlers
  const handleSubmit = (shouldGoLive?: true) => originalHandleSubmit(shouldGoLive);

  const handleMeasurementClick = (img: string, prop: keyof (UmojaLinnFemaleSizingTemplateProps | UmojaLinnMaleSizingTemplateProps)) => {
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
    const heightEvent = { target: { value: height.toString() } } as React.ChangeEvent<HTMLInputElement>;
    handleChange("height" as BothGenderSizingTemplateProps)(heightEvent);
    console.log("UK Size selected:", ukSize);
  };

  const handleSendReminder = () => {
    if (!effectiveProjectId) return;
    sendReminder({ projectId: effectiveProjectId, reminderType: modalType === "RECOMMEND" ? "BUYER_REMINDER" : "DESIGNER_REMINDER" });
  };

  // Designer recommend mode handlers
  const handleSelectMeasurement = (prop: string) => {
    setSelectedMeasurements((prev) => prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]);
    setHighlighted(prop as keyof (UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps));
  };

  const handleAddComment = (prop: string, comment: string) => setMeasurementComments((prev) => ({ ...prev, [prop]: comment }));
  const handleDeleteComment = (prop: string) => setMeasurementComments((prev) => { const c = { ...prev }; delete c[prop]; return c; });
  const handleSubmitRecommendations = () => requestChangeOnSizingTemplate(measurementComments);

  // Computed values
  const hasSavedMeasurements = sizingTemplateResult?.metadata?.reviews ? Object.values(sizingTemplateResult.metadata.reviews).some(Boolean) : false;
  const canSendReminderNow = canSendReminder(sizingTemplateResult?.lastReminderSentAt);
  const remainingReminderTime = getRemainingReminderTime(sizingTemplateResult?.lastReminderSentAt);
  const hasRequiredFields = !!(value?.height && value?.ukStandardSize);

  // Loading state
  if (props?.id && (isLoadingSizingTemplate || loadingMe || !sizingTemplateResult)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-[50vh] animate-pulse" />
      </div>
    );
  }

  // === MODE-BASED RENDERING ===

  // SELECT MODE - Designer selects measurement points to request from buyer
  if (templateMode === TEMPLATE_MODE.SELECT && effectiveProjectId) {
    return (
      <SelectModeView
        projectId={effectiveProjectId}
        projectName={project?.title ?? undefined}
        buyerName={project?.buyer?.user?.firstName ?? undefined}
        gender={gender}
        unit={unit}
        ukStandardSize={value?.ukStandardSize ?? undefined}
        height={typeof value?.height === "number" ? value.height : null}
        template={TEMPLATE}
        onSuccess={() => router.push(`/active-jobs/${effectiveProjectId}`)}
        onUnitChange={handleUnitChange}
      />
    );
  }

  // FILL MODE - Buyer fills in requested measurement points
  if (templateMode === TEMPLATE_MODE.FILL && sizingTemplateResult?.id && effectiveProjectId) {
    return (
      <FillModeView
        templateId={sizingTemplateResult.id}
        projectId={effectiveProjectId}
        templateName={name}
        gender={gender}
        unit={unit}
        ukStandardSize={value?.ukStandardSize}
        height={typeof value?.height === "number" ? value.height : null}
        requestedMeasurementPoints={requestedMeasurementPoints}
        currentValues={value}
        template={TEMPLATE}
        onSuccess={() => router.push(`/projects/${effectiveProjectId}`)}
        onUnitChange={handleUnitChange}
      />
    );
  }

  // UPDATE MODE - Buyer updates fields with recommendations
  if (templateMode === TEMPLATE_MODE.UPDATE && sizingTemplateResult?.id) {
    return (
      <UpdateModeView
        templateId={sizingTemplateResult.id}
        templateName={name}
        gender={gender}
        unit={unit}
        ukStandardSize={value?.ukStandardSize}
        height={typeof value?.height === "number" ? value.height : null}
        reviews={sizingTemplateResult.metadata?.reviews || {}}
        requestedMeasurementPoints={requestedMeasurementPoints}
        currentValues={value}
        template={TEMPLATE}
        onSuccess={() => router.push("/sizing-templates")}
        onUnitChange={handleUnitChange}
      />
    );
  }

  // VIEW MODE - Designer views the template (read-only, with recommend button)
  if (templateMode === TEMPLATE_MODE.VIEW || templateMode === TEMPLATE_MODE.RECOMMEND) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {recommendationMode && (
            <div className="text-sm text-foreground-body bg-amber-50 border border-amber-200 mb-6 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="font-bold mb-1">Recommendation mode</p>
              <p>Select measurement points and add comments to recommend changes to the buyer.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-6">
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-lg font-bold text-foreground-body mb-6">{name}</h1>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                    <GenderSelector gender={gender} disabled />
                    <FullBodyTab />
                    <UnitSelector unit={unit} onChange={handleUnitChange} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Show only requested/submitted points or all if none requested */}
                  {(!recommendationMode ? (hasRequestedPoints ? TEMPLATE.filter(item => requestedMeasurementPoints.includes(item.prop)) : TEMPLATE) : TEMPLATE).map((item, index) => {
                    const itemValue = value?.[item.prop];
                    return (
                      <MeasurementPointRow
                        key={item.prop}
                        disabled
                        onValueChange={handleChange(item.prop)}
                        value={typeof itemValue === "number" ? itemValue : 0}
                        unit={unit}
                        label={item.name}
                        highlighted={highlighted === item.prop}
                        metadata={{ review: sizingTemplateResult?.metadata?.reviews?.[item.prop], img: item?.img }}
                        onClick={() => handleMeasurementClick(item.img, item.prop as keyof (UmojaLinnFemaleSizingTemplateProps | UmojaLinnMaleSizingTemplateProps))}
                        onKeyDown={(e) => handleKeyPress(index, e)}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        {...(recommendationMode && {
                          recommendMode: true,
                          selected: selectedMeasurements.includes(item.prop),
                          onSelect: () => handleSelectMeasurement(item.prop),
                          hasComment: !!measurementComments[item.prop],
                          comment: measurementComments[item.prop],
                          onAddComment: (comment: string) => handleAddComment(item.prop, comment),
                          onDeleteComment: () => handleDeleteComment(item.prop),
                        })}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Mobile Actions */}
              {recommendationMode ? (
                <div className="lg:hidden mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setRecommendationMode(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleSubmitRecommendations} disabled={loading || Object.keys(measurementComments).length === 0} className="flex-1">Submit Changes</Button>
                </div>
              ) : hasRequestedPoints && (
                <div className="lg:hidden mt-6">
                  <Button fullWidth disabled={loading} onClick={() => setRecommendationMode(true)}>Recommend Changes</Button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <MeasurementGuide
                previewImage={previewImage}
                highlightedMeasurementName={highlightedSizingName}
                review={highlighted && (measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted]) ? measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted] || "" : undefined}
                className="sticky top-6"
              />

              {recommendationMode ? (
                <div className="hidden lg:flex flex-col gap-3 mt-6">
                  <Button variant="outline" onClick={() => setRecommendationMode(false)}>Cancel</Button>
                  <Button onClick={handleSubmitRecommendations} disabled={loading || Object.keys(measurementComments).length === 0} className="w-full">Submit Changes</Button>
                </div>
              ) : hasRequestedPoints && (
                <div className="hidden lg:block mt-6">
                  <Button disabled={loading} onClick={() => setRecommendationMode(true)} className="w-full">Recommend Changes</Button>
                </div>
              )}

              {highlighted && (measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted]) && (
                <div className="hidden lg:block mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <RequestSizingTemplateViewCard title={highlightedSizingName} review={measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted] || ""} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EDIT or VIEW_ONLY MODE - Buyer can edit (draft/live) or view only (in use)
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Banners */}
        {!hasRequestedPoints && effectiveProjectId && (
          <ReminderBanner
            message="Designer has not sent the measurement points"
            onSendReminder={handleSendReminder}
            lastReminderSentAt={sizingTemplateResult?.lastReminderSentAt}
            canSendReminder={canSendReminderNow}
            remainingTime={remainingReminderTime ?? undefined}
            className="mb-6"
          />
        )}
        
        {hasSavedMeasurements && templateMode === TEMPLATE_MODE.VIEW_ONLY && (
          <SavedMeasurementsNotice variant="saved" onSubmit={() => handleSubmit()} className="mb-6" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <MeasurementForm
              name={name}
              gender={gender}
              unit={unit}
              template={TEMPLATE}
              value={value}
              highlighted={highlighted}
              sizingTemplateResult={sizingTemplateResult as { metadata: { reviews?: Partial<Record<string, string>> } | undefined; submittedMeasurementPoints?: string[]; requestedMeasurementPoints?: string[]; defaultFieldsLocked?: boolean }}
              modalType={modalType}
              onGenderChange={(value) => setGender(value as UmojaLinnSizingTemplate["gender"])}
              onUnitChange={handleUnitChange}
              onValueChange={(prop) => handleChange(prop as BothGenderSizingTemplateProps)}
              onMeasurementClick={(img, prop) => handleMeasurementClick(img, prop as BothGenderSizingTemplateProps)}
              onKeyPress={handleKeyPress}
              onHeightAndSizeChange={handleHeightAndSizeChange}
              inputRefs={inputRefs}
            />

            {/* Mobile Actions */}
            <div className="lg:hidden mt-6 flex flex-col gap-3">
              {templateMode === TEMPLATE_MODE.EDIT && isDraft && (
                <AddToJobDropdown templateId={props.id} disabled={!hasRequiredFields} onSuccess={() => router.push("/sizing-templates")} className="w-full" />
              )}
              <ActionButtons
                onSave={() => handleSubmit()}
                onSubmit={() => handleSubmit(true)}
                loading={loading}
                showSave={!!(templateMode === TEMPLATE_MODE.EDIT || hasReviews) && !props.disableSaving}
                showSubmit={!!(isDraft || !props.id)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {hasSavedMeasurements && <SuccessMessage className="mb-4" />}
            <div className="sticky top-16">
              <MeasurementGuide
                previewImage={previewImage}
                highlightedMeasurementName={highlightedSizingName}
                review={highlighted && sizingTemplateResult?.metadata?.reviews?.[highlighted] ? sizingTemplateResult.metadata.reviews[highlighted] : undefined}
              />
              <div className="hidden lg:flex flex-col gap-3 mt-6">
                {templateMode === TEMPLATE_MODE.EDIT && isDraft && (
                  <AddToJobDropdown templateId={props.id} disabled={!hasRequiredFields} onSuccess={() => router.push("/sizing-templates")} />
                )}
                <ActionButtons
                  onSave={() => handleSubmit()}
                  onSubmit={() => handleSubmit(true)}
                  loading={loading}
                  showSave={!!(templateMode === TEMPLATE_MODE.EDIT || hasReviews) && !props.disableSaving}
                  showSubmit={!!(isDraft || !props.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizingTemplatePage;
