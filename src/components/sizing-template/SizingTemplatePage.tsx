"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SizingTemplateDialogProps, useSizingTemplateDialog } from "@/hooks/use-sizing-template";
import { TEMPLATE_MODE } from "@/types/constants";
import MeasurementGuide from "./MeasurementGuide";
import SuccessMessage from "./SuccessMessage";
import ActionButtons from "./ActionButtons";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
import GenderTabs from "./GenderTabs";
import UnitSelector from "./UnitSelector";
import MeasurementPointRow from "./MeasurementPointRow";
import SavedMeasurementsNotice from "./SavedMeasurementsNotice";
import AddToJobDropdown from "./AddToJobDropdown";
import ReminderBanner from "./ReminderBanner";
import SelectModeView from "./SelectModeView";
import FillModeView from "./FillModeView";
import UpdateModeView from "./UpdateModeView";
import UKStandardSizeRow from "./UKStandardSizeRow";
import UKSizeChartTable from "./UKSizeChartTable";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import { UmojaLinnFemaleSizingTemplateProps, UmojaLinnMaleSizingTemplateProps } from "@/types/project";
import { canSendReminder, getRemainingReminderTime } from "@/lib/sizing-template-utils";
import { useSendSizingTemplateReminder } from "@/tanstack/hooks/useSizingTemplates";
import { useGetProjectById, useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import TextField from "../custom/input/TextField";

type BothGenderSizingTemplateProps = keyof (UmojaLinnFemaleSizingTemplateProps | UmojaLinnMaleSizingTemplateProps);

type SizingTemplatePageProps = Omit<SizingTemplateDialogProps, "children"> & {
  projectId?: string;
};

const SizingTemplatePage = (props: SizingTemplatePageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const sizingTemplateId = props.id;
  const effectiveProjectId = props.projectId || urlProjectId || undefined;

  // Fetch project data if we have a project ID
  const { data: projectData } = useGetProjectById(effectiveProjectId);
  const project = projectData?.data?.data;

  // Fetch available projects for "Add to Job" dropdown (LIVE projects without a sizing template)
  const { data: buyerProjectsData, isLoading: isLoadingProjects } = useGetAllBuyerProject({
    projectStatus: "LIVE",
  });
  const availableProjects = (buyerProjectsData?.data?.data || []).filter(
    (proj) => !proj.sizingTemplate?.id
  );

  // State for showing UK size chart in preview panel
  const [showUKSizeChart, setShowUKSizeChart] = useState(false);

  const {
    loading,
    highlightedSizingName,
    handleChange,
    handleSubmit: originalHandleSubmit,
    sizingTemplateResult,
    isDraft,
    TEMPLATE,
    name,
    setName,
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
    hasSubmittedPoints,
    isInUse,
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
    setShowUKSizeChart(false);
    setPreviewImage(img);
    setHighlighted(prop);
  };

  const handleUnitChange = (newUnit: UmojaLinnSizingTemplate["unit"]) => {
    setUnit((prevUnit) => {
      handleChangeValuesByUnit(prevUnit, newUnit);
      return newUnit;
    });
  };

  const handleUKSizeChange = (ukSize: UmojalinnStandardSize) => {
    const event = { target: { value: ukSize } } as React.ChangeEvent<HTMLInputElement>;
    handleChange("ukStandardSize" as BothGenderSizingTemplateProps)(event);
  };

  const handleShowUKSizeChart = () => {
    setShowUKSizeChart(true);
    setHighlighted(null);
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
  const hasRequiredFields = !!(value?.height && value?.ukStandardSize && unit);
  const isCreatingNew = !sizingTemplateId;
  const isEditable = !isInUse && (templateMode === TEMPLATE_MODE.EDIT || isCreatingNew);
  const canEditGender = isEditable && !isInUse;

  // Page title and description based on mode
  const getPageTitle = () => {
    if (isCreatingNew) return "Create a New Template";
    if (isDraft) return "Edit Template";
    if (isInUse) return name || "View Template";
    return name || "Sizing Template";
  };

  const getPageDescription = () => {
    if (isCreatingNew) return "Add your measurements and save for later use";
    if (isDraft) return "Update your measurements and save changes";
    if (isInUse) return "This template is currently in use with a project";
    return "View and manage your sizing template";
  };

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
        buyerName={project?.buyer?.user?.firstName}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-6">
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-lg font-bold text-foreground-body mb-6">{name}</h1>
                  <div className="space-y-10 items-start sm:items-center mb-6">
                    <GenderTabs gender={gender} onChange={() => {}} disabled />
                      <div className="flex justify-end items-center">
                        {/* <h3 className="text-md font-semibold text-foreground-body">Units</h3>  */}
                        <UnitSelector unit={unit} onChange={handleUnitChange} />
                      </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
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

              {/* Mobile Actions - Recommend Changes only shows after buyer submits */}
              {recommendationMode ? (
                <div className="lg:hidden mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setRecommendationMode(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleSubmitRecommendations} disabled={loading || Object.keys(measurementComments).length === 0} className="flex-1">Submit Changes</Button>
                </div>
              ) : hasSubmittedPoints && (
                <div className="lg:hidden mt-6">
                  <Button fullWidth disabled={loading} onClick={() => setRecommendationMode(true)}>Recommend Changes</Button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              <div className="sticky top-20">
                <MeasurementGuide
                  previewImage={previewImage}
                  highlightedMeasurementName={highlightedSizingName}
                  review={highlighted && (measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted]) ? measurementComments[highlighted] || sizingTemplateResult?.metadata?.reviews?.[highlighted] || "" : undefined}
                  className=""
                />

                {/* Desktop Actions - Recommend Changes only shows after buyer submits */}
                {recommendationMode ? (
                  <div className="hidden lg:flex flex-col gap-3 mt-6">
                    <Button variant="outline" onClick={() => setRecommendationMode(false)}>Cancel</Button>
                    <Button onClick={handleSubmitRecommendations} disabled={loading || Object.keys(measurementComments).length === 0} className="w-full">Submit Changes</Button>
                  </div>
                ) : hasSubmittedPoints && (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="animate-in fade-in duration-300">
              <h1 className="text-lg font-bold text-foreground-body">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500 mt-1">{getPageDescription()}</p>
            </div>

            {/* Gender Tabs */}
            <div className="animate-in fade-in duration-300 delay-75">
              <GenderTabs
                gender={gender}
                onChange={(newGender) => setGender(newGender)}
                disabled={!canEditGender}
              />
            </div>

            {/* Template Name Input - only when not in use */}
            {!isInUse && (
                <TextField 
                  placeholder="Template Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  className="rounded-md h-16"
                />
            )}

            {/* Units Row */}
            <div className="flex justify-between items-center animate-in fade-in duration-300 delay-125">
              <h3 className="text-md font-semibold text-foreground-body">Units</h3>
              <UnitSelector
                unit={unit}
                onChange={handleUnitChange}
                disabled={!isEditable}
              />
            </div>

            {/* Table Headers */}
            <div className="flex justify-between items-center text-sm text-gray-500 border-b border-gray-200 pb-2 animate-in fade-in duration-300 delay-150">
              <span className="font-medium">Measurement Point</span>
              <span className="font-medium">Measurement</span>
            </div>

            {/* UK Standard Size Row */}
            <UKStandardSizeRow
              gender={gender}
              value={value?.ukStandardSize ?? null}
              onChange={handleUKSizeChange}
              onShowChart={handleShowUKSizeChart}
              highlighted={showUKSizeChart}
              disabled={!isEditable}
            />

            {/* Measurement Points (including Height as first item from TEMPLATE) */}
            <div className="flex flex-col gap-2">
              {TEMPLATE.map((templateItem, index) => {
                const isDisabled = !isEditable;
                const itemValue = value?.[templateItem.prop as keyof typeof value];
                const reviews = sizingTemplateResult?.metadata?.reviews as Record<string, string> | undefined;
                const reviewValue = reviews?.[templateItem.prop];
                const isSubmitted = (sizingTemplateResult?.submittedMeasurementPoints ?? []).includes(templateItem.prop);

                return (
                  <MeasurementPointRow
                    key={templateItem.prop}
                    disabled={isDisabled}
                    onValueChange={handleChange(templateItem.prop as BothGenderSizingTemplateProps)}
                    value={typeof itemValue === "number" ? itemValue : 0}
                    unit={unit}
                    label={templateItem.name}
                    onFocus={() => handleMeasurementClick(templateItem.img, templateItem.prop as BothGenderSizingTemplateProps)}
                    highlighted={highlighted === templateItem.prop}
                    hasLiveProject={false}
                    metadata={{ review: reviewValue, img: templateItem?.img }}
                    onClick={() => handleMeasurementClick(templateItem.img, templateItem.prop as BothGenderSizingTemplateProps)}
                    onKeyDown={(e) => handleKeyPress(index, e)}
                    isSubmitted={isSubmitted}
                    ref={(el) => { inputRefs.current[index] = el; }}
                  />
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden mt-6 flex justify-end gap-3">
              {isEditable && !isInUse && (
                <AddToJobDropdown
                  templateId={sizingTemplateId}
                  disabled={!hasRequiredFields}
                  onSuccess={() => router.push("/sizing-templates")}
                  availableProjects={availableProjects}
                  isLoadingProjects={isLoadingProjects}
                  className="w-full"
                />
              )}
              <ActionButtons
                onSave={() => handleSubmit()}
                onSubmit={() => handleSubmit(true)}
                loading={loading}
                showSave={isEditable && !props.disableSaving}
                showSubmit={!!(isDraft || isCreatingNew)}
              />
            </div>
          </div>

          {/* Right Column - Preview Panel */}
          <div>
            {hasSavedMeasurements && <SuccessMessage className="mb-4" />}
            <div className="sticky top-16">
              {showUKSizeChart ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px]">
                  <UKSizeChartTable gender={gender} />
                </div>
              ) : (
                <MeasurementGuide
                  previewImage={previewImage}
                  highlightedMeasurementName={highlightedSizingName}
                  review={highlighted && sizingTemplateResult?.metadata?.reviews?.[highlighted] ? sizingTemplateResult.metadata.reviews[highlighted] : undefined}
                />
              )}
              
              {/* Desktop Actions */}
              <div className="hidden lg:flex justify-end gap-3 mt-6">
                {isEditable && !isInUse && (
                  <AddToJobDropdown
                    templateId={sizingTemplateId}
                    disabled={!hasRequiredFields}
                    onSuccess={() => router.push("/sizing-templates")}
                    availableProjects={availableProjects}
                    isLoadingProjects={isLoadingProjects}
                  />
                )}
                <ActionButtons
                  onSave={() => handleSubmit()}
                  onSubmit={() => handleSubmit(true)}
                  loading={loading}
                  showSave={isEditable && !props.disableSaving}
                  showSubmit={!!(isDraft || isCreatingNew)}
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
