"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNextStep } from "nextstepjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  SizingTemplateDialogProps,
  useSizingTemplateDialog,
} from "@/hooks/use-sizing-template";
import {
  TEMPLATE_MODE,
  SIZING_TEMPLATE_REMINDER_TYPE,
} from "@/constant";
import MeasurementGuide from "./MeasurementGuide";
import SuccessMessage from "./SuccessMessage";
import ActionButtons from "./ActionButtons";
// import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";
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
import {
  UmojaLinnSizingTemplate,
  UmojalinnStandardSize,
} from "@/types/project";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
} from "@/types/project";
import {
  canSendReminder,
  getRemainingReminderTime,
} from "@/lib/sizing-template-utils";
import {
  useSendSizingTemplateReminder,
  useRequestMeasurementPoints,
} from "@/tanstack/hooks/useSizingTemplates";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import TextField from "../custom/input/TextField";
import DisabledTemplateItems from "./DisabledTemplateItems";

type BothGenderSizingTemplateProps = keyof (
  | UmojaLinnFemaleSizingTemplateProps
  | UmojaLinnMaleSizingTemplateProps
);

type SizingTemplatePageProps = Omit<SizingTemplateDialogProps, "children"> & {
  projectId?: string;
  bidId?: string;
};

const SizingTemplatePage = (props: SizingTemplatePageProps) => {
  const {
    loading,
    highlightedSizingName,
    handleChange,
    handleSubmit: originalHandleSubmit,
    sizingTemplateResult,
    isDraft,
    isNewTemplate,
    // isTemplateHaveLiveProject,
    TEMPLATE,
    // open,
    // setOpen,
    name,
    gender,
    unit,
    value,
    highlighted,
    setHighlighted,
    setGender,
    setName,
    setUnit,
    handleChangeValuesByUnit,
    recommendationMode,
    // openRequestChangesDialog,
    // setOpenRequestChangesDialog,
    setRecommendationMode,
    loadingMe,
    isLoadingSizingTemplate,
    requestChangeOnSizingTemplate,
    handleKeyPress,
    previewImage,
    setPreviewImage,
    inputRefs,
    // modalType,
    // editMode,
    // setEditMode,
    // New mode-related exports
    templateMode,
    requestedMeasurementPoints,
    submittedMeasurementPoints,
    hasRequestedPoints,
    hasSubmittedPoints,
    // hasReviews,
    isInUse,
    canBuyerFullyEdit,
    isDesigner,
    router,
    // searchParams,
    // urlProjectId,
    sizingTemplateId,
    effectiveProjectId,
    // projectData,
    project,
    isProjectLive,
  } = useSizingTemplateDialog({
    ...props,
    handleSuccess: (template) => {
      router.push("/sizing-templates");
      props.handleSuccess?.(template);
    },
  });

  // Fetch available projects for "Add to Job" dropdown (LIVE projects without a sizing template)
  const { data: buyerProjectsData, isLoading: isLoadingProjects } =
    useGetAllBuyerProject({
      projectStatus: "ADS",
    });
  const availableProjects = (buyerProjectsData?.data?.data || []).filter(
    (proj) => !proj.sizingTemplate?.id,
  );

  // State for showing UK size chart in preview panel
  const [showUKSizeChart, setShowUKSizeChart] = useState(false);

  // Designer recommendation mode state
  const [selectedMeasurements, setSelectedMeasurements] = React.useState<
    string[]
  >([]);
  const [measurementComments, setMeasurementComments] = React.useState<
    Record<string, string>
  >({});

  // Drive the "Recommend Changes" guided tour: the tour walks through the
  // recommend-mode UI, so we mirror the current step into page state.
  const { currentTour, currentStep } = useNextStep();
  const isRecommendTour = currentTour === "recommend-sizing-changes";
  const wasRecommendTour = useRef(false);

  useEffect(() => {
    if (!isDesigner) return;

    if (isRecommendTour) {
      wasRecommendTour.current = true;
      // Step 0 shows the read-only view with the "Recommend Changes" button;
      // every step after that walks through recommend mode.
      setRecommendationMode(currentStep >= 1);
    } else if (wasRecommendTour.current) {
      wasRecommendTour.current = false;
      setRecommendationMode(false);
    }
  }, [isDesigner, isRecommendTour, currentStep, setRecommendationMode]);

  useEffect(() => {
    if (!recommendationMode) return;
    const reviews = sizingTemplateResult?.metadata?.reviews;
    const propsWithExistingReviews = reviews
      ? Object.entries(reviews)
          .filter(([, text]) => !!text)
          .map(([key]) => key)
      : [];

    setSelectedMeasurements((prev) => {
      const merged = new Set([
        ...requestedMeasurementPoints,
        ...propsWithExistingReviews,
        ...prev,
      ]);
      return Array.from(merged);
    });
  }, [
    recommendationMode,
    requestedMeasurementPoints,
    sizingTemplateResult?.metadata?.reviews,
  ]);

  // Reminder mutation
  const { mutate: sendReminder } = useSendSizingTemplateReminder(
    sizingTemplateResult?.id || "",
  );

  // Handlers
  const handleSubmit = (shouldGoLive?: true) =>
    originalHandleSubmit(shouldGoLive);

  const handleMeasurementClick = (
    img: string,
    prop: keyof (
      | UmojaLinnFemaleSizingTemplateProps
      | UmojaLinnMaleSizingTemplateProps
    ),
  ) => {
    setShowUKSizeChart(false);
    setPreviewImage(img);
    setHighlighted(prop);
  };

  const handleUnitChange = (newUnit: UmojaLinnSizingTemplate["unit"]) => {
    handleChangeValuesByUnit(unit, newUnit);
    setUnit(newUnit);
  };

  const handleUKSizeChange = (ukSize: UmojalinnStandardSize) => {
    const event = {
      target: { value: ukSize },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange("ukStandardSize" as BothGenderSizingTemplateProps)(event);
  };

  const handleShowUKSizeChart = () => {
    setShowUKSizeChart(true);
    setHighlighted(null);
  };

  const handleSendReminder = () => {
    if (!effectiveProjectId) return;
    sendReminder({
      projectId: effectiveProjectId,
      reminderType: isDesigner ? "BUYER_REMINDER" : "DESIGNER_REMINDER",
    });
  };

  // Designer recommend mode handlers
  const handleSelectMeasurement = (prop: string) => {
    setSelectedMeasurements((prev) =>
      prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop],
    );
    setHighlighted(
      prop as keyof (UmojaLinnFemaleSizingTemplateProps &
        UmojaLinnMaleSizingTemplateProps),
    );
  };

  const handleAddComment = (prop: string, comment: string) =>
    setMeasurementComments((prev) => ({ ...prev, [prop]: comment }));
  /** Empty string = user removed a comment; merge logic treats that as overriding server state. */
  const handleDeleteComment = (prop: string) =>
    setMeasurementComments((prev) => ({ ...prev, [prop]: "" }));

  const getEffectiveReviewForProp = (prop: string) =>
    prop in measurementComments
      ? measurementComments[prop]
      : ((
          sizingTemplateResult?.metadata?.reviews as
            | Record<string, string>
            | undefined
        )?.[prop] ?? "");

  const buildMergedReviewsPayload = (): Record<string, string> => {
    const server = (sizingTemplateResult?.metadata?.reviews ?? {}) as Record<
      string,
      string
    >;
    const merged: Record<string, string> = { ...server };
    for (const [prop, text] of Object.entries(measurementComments)) {
      if (text === "") delete merged[prop];
      else merged[prop] = text;
    }
    return merged;
  };

  const {
    mutateAsync: requestMeasurementPointsAsync,
    isPending: isPendingNewRequests,
  } = useRequestMeasurementPoints();

  const handleSubmitRecommendations = async () => {
    const hasExistingReviews =
      !!sizingTemplateResult?.metadata?.reviews &&
      Object.values(sizingTemplateResult.metadata.reviews).some(Boolean);
    const hasNewComments = Object.keys(measurementComments).length > 0;

    const currentRequestedSet = new Set(requestedMeasurementPoints);
    const selectedRequestedSet = new Set(selectedMeasurements);
    const hasRequestedPointsChanged =
      requestedMeasurementPoints.length !== selectedMeasurements.length ||
      selectedMeasurements.some((prop) => !currentRequestedSet.has(prop));

    // Sync requested points whenever the selection changed (additions or removals)
    if (hasRequestedPointsChanged && effectiveProjectId) {
      await requestMeasurementPointsAsync({
        projectId: effectiveProjectId,
        requestedMeasurementPoints: Array.from(selectedRequestedSet),
      });
    }

    // Send merged reviews (server + local edits/deletes) so untouched comments persist.
    if (hasNewComments || hasExistingReviews) {
      requestChangeOnSizingTemplate(buildMergedReviewsPayload());
    } else {
      // If we only requested new points, we should still close the mode
      setRecommendationMode(false);
      // Wait for React Query invalidation
      router.refresh();
    }
  };

  // Computed values
  const hasSavedMeasurements = sizingTemplateResult?.metadata?.reviews
    ? Object.values(sizingTemplateResult.metadata.reviews).some(Boolean)
    : false;
  const canSendReminderNow =
    sizingTemplateResult?.lastReminderSentBy ===
    (isDesigner
      ? SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER
      : SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER)
      ? canSendReminder(sizingTemplateResult?.lastReminderSentAt)
      : true;
  const remainingReminderTime =
    sizingTemplateResult?.lastReminderSentBy ===
    (isDesigner
      ? SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER
      : SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER)
      ? getRemainingReminderTime(sizingTemplateResult?.lastReminderSentAt)
      : undefined;
  const hasRequiredFields = !!(value?.height && value?.ukStandardSize && unit);
  const isCreatingNew = !sizingTemplateId;
  const isEditable =
    canBuyerFullyEdit &&
    (templateMode === TEMPLATE_MODE.EDIT || isCreatingNew);
  const canEditGender = isEditable && canBuyerFullyEdit;
  const isChangesUpdated = sizingTemplateResult?.isChangesUpdated;
  const isRestrictedInUse = isInUse && isProjectLive;

  // Page title and description based on mode
  const getPageTitle = () => {
    if (isCreatingNew) return "Create a New Template";
    if (isDraft || canBuyerFullyEdit) return "Edit Template";
    if (isRestrictedInUse) return name || "View Template";
    return name || "Sizing Template";
  };

  const getPageDescription = () => {
    if (isCreatingNew) return "Add your measurements and save for later use";
    if (isDraft || canBuyerFullyEdit)
      return "Update your measurements and save changes";
    if (isRestrictedInUse)
      return "This template is currently in use with a project";
    return "View and manage your sizing template";
  };

  // Loading state
  if (
    props?.id &&
    (isLoadingSizingTemplate || loadingMe || !sizingTemplateResult)
  ) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-[50vh] animate-pulse" />
      </div>
    );
  }

  // === MODE-BASED RENDERING ===

  // SELECT MODE - Designer selects measurement points to request from buyer
  if (
    templateMode === TEMPLATE_MODE.SELECT &&
    (effectiveProjectId || props?.bidId)
  ) {
    return (
      <SelectModeView
        projectId={effectiveProjectId}
        bidId={props.bidId}
        projectName={project?.title ?? undefined}
        buyerName={project?.buyer?.user?.firstName}
        gender={gender}
        unit={unit}
        ukStandardSize={value?.ukStandardSize ?? undefined}
        height={typeof value?.height === "number" ? value.height : null}
        template={TEMPLATE}
        hasTemplate={!!sizingTemplateId}
        isProjectLive={isProjectLive}
        prefilledPoints={requestedMeasurementPoints}
        onSuccess={() => {
          if (props.handleSuccess) {
            props.handleSuccess(sizingTemplateResult || undefined);
          }
        }}
        onUnitChange={handleUnitChange}
      />
    );
  }

  // FILL MODE - Buyer fills in requested measurement points
  if (
    templateMode === TEMPLATE_MODE.FILL &&
    sizingTemplateResult?.id &&
    effectiveProjectId
  ) {
    return (
      <FillModeView
        key={gender}
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
  if (
    templateMode === TEMPLATE_MODE.UPDATE &&
    sizingTemplateResult?.id &&
    effectiveProjectId
  ) {
    return (
      <UpdateModeView
        templateId={sizingTemplateResult.id}
        projectId={effectiveProjectId}
        templateName={name}
        gender={gender}
        unit={unit}
        ukStandardSize={value?.ukStandardSize}
        height={typeof value?.height === "number" ? value.height : null}
        reviews={sizingTemplateResult.metadata?.reviews || {}}
        requestedMeasurementPoints={requestedMeasurementPoints}
        currentValues={value}
        template={TEMPLATE}
        onSuccess={() => router.push(`/projects/${effectiveProjectId}`)}
        onUnitChange={handleUnitChange}
      />
    );
  }

  // VIEW MODE - Designer views the template (read-only, with recommend button)
  if (
    templateMode === TEMPLATE_MODE.VIEW ||
    templateMode === TEMPLATE_MODE.RECOMMEND
  ) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Banners */}
          {hasRequestedPoints &&
            !hasSubmittedPoints &&
            isProjectLive &&
            effectiveProjectId && (
              <ReminderBanner
                message={
                  sizingTemplateId
                    ? "Awaiting Measurements"
                    : "Buyer has not attached a template yet"
                }
                onSendReminder={handleSendReminder}
                lastReminderSentAt={sizingTemplateResult?.lastReminderSentAt}
                canSendReminder={canSendReminderNow}
                remainingTime={remainingReminderTime ?? undefined}
                className="mb-6"
              />
            )}

          {recommendationMode && (
            <div className="text-sm text-foreground-body bg-amber-50 border border-amber-200 mb-6 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="font-bold mb-1">Recommendation mode</p>
              <p>
                Select measurement points and add comments to recommend changes
                to the buyer.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-6">
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-lg font-bold text-foreground-body mb-6">
                    {name}
                  </h1>
                  <div className="space-y-10 items-start sm:items-center mb-6">
                    {/* <GenderTabs gender={gender} onChange={() => {}} disabled /> */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold text-foreground-body">
                        Units
                      </h3>
                      <UnitSelector unit={unit} onChange={handleUnitChange} />
                    </div>
                  </div>
                </div>

                <div
                  id="tour-sizing-template-measurement-points"
                  className="flex flex-col gap-2"
                >
                  <DisabledTemplateItems title={gender} />

                  {/* UK Standard Size Row */}
                  <UKStandardSizeRow
                    gender={gender}
                    value={value?.ukStandardSize ?? null}
                    onChange={() => {}}
                    onShowChart={() => {}}
                    highlighted={false}
                    disabled
                    // isDesigner={isDesigner}
                  />

                  <DisabledTemplateItems
                    title="Height"
                    value={value?.height ? `${value?.height} ${unit}` : "-"}
                  />

                  {/* Measurement Points */}
                  {(recommendationMode
                    ? TEMPLATE.filter((item) => item.prop !== "height")
                    : hasRequestedPoints
                      ? TEMPLATE.filter((item) =>
                          requestedMeasurementPoints.includes(item.prop),
                        )
                      : TEMPLATE
                  )
                    .sort((a, b) => {
                      const getSortPriority = (
                        prop: BothGenderSizingTemplateProps,
                      ) => {
                        const hasReview =
                          !!sizingTemplateResult?.metadata?.reviews?.[prop];
                        if (hasReview) return 0;

                        const measurementValue =
                          value?.[prop as keyof typeof value];

                        const isNewRequestedPoint =
                          !recommendationMode && measurementValue === null;

                        if (isNewRequestedPoint) return 1;

                        return 2;
                      };

                      return (
                        getSortPriority(
                          a.prop as BothGenderSizingTemplateProps,
                        ) -
                        getSortPriority(b.prop as BothGenderSizingTemplateProps)
                      );
                    })
                    .map((item, index) => {
                      const itemValue = value?.[item.prop];
                      const isRequested = requestedMeasurementPoints.includes(
                        item.prop,
                      );
                      const isSubmitted =
                        submittedMeasurementPoints.includes(item.prop);
                      const hasReview =
                        !!sizingTemplateResult?.metadata?.reviews?.[item.prop];

                      const isPendingBuyerReply =
                        !recommendationMode && hasReview;
                      const isNewlyUpdated =
                        !recommendationMode &&
                        !hasReview &&
                        isChangesUpdated &&
                        isSubmitted;

                      // Designer should not see the stored value of a point
                      // they have requested until the buyer responds, even if
                      // an old value exists on the buyer's profile.
                      const hideValueFromDesigner =
                        isDesigner && isRequested && !isSubmitted;

                      return (
                        <MeasurementPointRow
                          key={item.prop}
                          disabled
                          onValueChange={handleChange(item.prop)}
                          value={typeof itemValue === "number" ? itemValue : 0}
                          unit={unit}
                          label={item.name}
                          highlighted={highlighted === item.prop}
                          metadata={{
                            review:
                              sizingTemplateResult?.metadata?.reviews?.[
                                item.prop
                              ],
                            img: item?.img,
                          }}
                          isPendingBuyerReply={isPendingBuyerReply}
                          isNewlyUpdated={isNewlyUpdated}
                          hideValue={hideValueFromDesigner}
                          onClick={() => {
                            handleMeasurementClick(
                              item.img,
                              item.prop as keyof (
                                | UmojaLinnFemaleSizingTemplateProps
                                | UmojaLinnMaleSizingTemplateProps
                              ),
                            );
                          }}
                          isDesigner={isDesigner}
                          onKeyDown={(e) => handleKeyPress(index, e)}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          {...(index === 0 && {
                            rootId: "tour-recommend-measurement-point",
                            addCommentButtonId: "tour-recommend-add-comment",
                            deleteButtonId: "tour-recommend-delete-comment",
                            forceShowActions: isRecommendTour,
                          })}
                          {...(recommendationMode && {
                            recommendMode: true,
                            selected: selectedMeasurements.includes(item.prop),
                            onSelect: () => handleSelectMeasurement(item.prop),
                            hasComment: !!getEffectiveReviewForProp(item.prop),
                            comment: getEffectiveReviewForProp(item.prop),
                            onAddComment: (comment: string) =>
                              handleAddComment(item.prop, comment),
                            onDeleteComment: () =>
                              handleDeleteComment(item.prop),
                            isNewRequest: !isRequested, // Pass flag to indicate this is a new measurement request
                          })}
                        />
                      );
                    })}
                </div>
              </div>

              {/* Mobile Actions - Recommend Changes only shows after buyer submits */}
              {recommendationMode ? (
                <div className="lg:hidden mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setRecommendationMode(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitRecommendations}
                    disabled={
                      loading ||
                      isPendingNewRequests ||
                      (Object.keys(measurementComments).length === 0 &&
                        selectedMeasurements.length === 0)
                    }
                    className="flex-1"
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                hasSubmittedPoints && (
                  <div className="lg:hidden mt-6">
                    <Button
                      fullWidth
                      disabled={loading}
                      onClick={() => setRecommendationMode(true)}
                    >
                      Recommend Changes
                    </Button>
                  </div>
                )
              )}
            </div>

            {/* Right Column */}
            <div>
              <div
                id="tour-sizing-template-visual-reference"
                className="sticky top-20"
              >
                <MeasurementGuide
                  previewImage={previewImage}
                  highlightedMeasurementName={highlightedSizingName}
                  review={
                    highlighted
                      ? getEffectiveReviewForProp(highlighted) || undefined
                      : undefined
                  }
                  className=""
                />

                {/* Desktop Actions - Recommend Changes only shows after buyer submits */}
                {recommendationMode ? (
                  <div className="hidden lg:flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setRecommendationMode(false)}
                      className="h-8 rounded-md"
                    >
                      Cancel
                    </Button>
                    <Button
                      id="tour-recommend-submit"
                      onClick={handleSubmitRecommendations}
                      disabled={
                        loading ||
                        isPendingNewRequests ||
                        (Object.keys(measurementComments).length === 0 &&
                          selectedMeasurements.length === 0)
                      }
                      className="h-8 rounded-md"
                    >
                      Submit Changes
                    </Button>
                  </div>
                ) : (
                  hasSubmittedPoints && (
                    <div className="hidden lg:flex justify-end mt-6">
                      <Button
                        id="tour-recommend-changes-button"
                        disabled={loading}
                        onClick={() => setRecommendationMode(true)}
                        className="h-8 rounded-md bg-primary-600"
                      >
                        Recommend Changes
                      </Button>
                    </div>
                  )
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
        {!hasRequestedPoints && isProjectLive && effectiveProjectId && (
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
          <SavedMeasurementsNotice
            variant="saved"
            onSubmit={() => handleSubmit()}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="animate-in fade-in duration-300">
              <h1 className="text-lg font-bold text-foreground-body">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {getPageDescription()}
              </p>
            </div>

            {/* Gender Tabs */}
            {/* Template Name Input - only when buyer can fully edit */}
            {canBuyerFullyEdit && (
              <>
                <div className="animate-in fade-in duration-300 delay-75">
                  <GenderTabs
                    gender={gender}
                    onChange={(newGender) => setGender(newGender)}
                    disabled={!canEditGender}
                  />
                </div>

                <TextField
                  placeholder="Template Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md h-16"
                />
              </>
            )}

            {/* Units Row */}
            <div className="flex justify-between items-center animate-in fade-in duration-300 delay-125">
              <h3 className="text-md font-semibold text-foreground-body">
                Units
              </h3>
              <UnitSelector
                unit={unit}
                onChange={handleUnitChange}
                // disabled={!isEditable}
              />
            </div>

            {/* Measurement points — tour spotlight target */}
            <div
              id="tour-sizing-template-measurement-points"
              className="flex flex-col gap-6"
            >
              {/* Table Headers */}
              <div className="flex justify-between items-center text-sm text-gray-500 border-b border-gray-200 pb-2 animate-in fade-in duration-300 delay-150">
                <span className="font-medium">Measurement Point</span>
                <span className="font-medium">Measurement</span>
              </div>

              <div className="flex flex-col gap-2">
                {isRestrictedInUse && (
                  <DisabledTemplateItems title={gender} />
                )}

                {/* UK Standard Size Row */}
                <UKStandardSizeRow
                  gender={gender}
                  value={value?.ukStandardSize ?? null}
                  onChange={handleUKSizeChange}
                  onShowChart={handleShowUKSizeChart}
                  highlighted={showUKSizeChart}
                  disabled={!isEditable}
                  // isDesigner={isDesigner}
                />

                {isRestrictedInUse && (
                  <DisabledTemplateItems
                    title="Height"
                    value={value?.height ? `${value?.height} ${unit}` : "-"}
                  />
                )}
              </div>

              {/* Measurement Points (including Height as first item from TEMPLATE) */}
              {((sizingTemplateId &&
                (canBuyerFullyEdit ||
                  ((hasRequestedPoints || hasSubmittedPoints) &&
                    isProjectLive))) ||
                isNewTemplate ||
                isDraft) && (
                <div className="flex flex-col gap-2">
                  {TEMPLATE.filter((templateItem) => {
                    // Full edit (new, draft, live, or IN_USE before project LIVE): show all
                    if (canBuyerFullyEdit || isNewTemplate || isDraft)
                      return true;

                    // After job is LIVE: only show requested measurement points
                    if (isRestrictedInUse && hasRequestedPoints) {
                      return requestedMeasurementPoints.includes(
                        templateItem.prop,
                      );
                    }

                    // Default: show all
                    return true;
                  }).map((templateItem, index) => {
                    const isDisabled = !isEditable;
                    const itemValue =
                      value?.[templateItem.prop as keyof typeof value];
                    const reviews = sizingTemplateResult?.metadata?.reviews as
                      | Record<string, string>
                      | undefined;
                    const reviewValue = reviews?.[templateItem.prop];

                    return (
                      <MeasurementPointRow
                        key={templateItem.prop}
                        disabled={isDisabled}
                        onValueChange={handleChange(
                          templateItem.prop as BothGenderSizingTemplateProps,
                        )}
                        value={typeof itemValue === "number" ? itemValue : 0}
                        unit={unit}
                        label={templateItem.name}
                        onFocus={() =>
                          handleMeasurementClick(
                            templateItem.img,
                            templateItem.prop as BothGenderSizingTemplateProps,
                          )
                        }
                        highlighted={highlighted === templateItem.prop}
                        hasLiveProject={false}
                        metadata={{
                          review: reviewValue,
                          img: templateItem?.img,
                        }}
                        onClick={() =>
                          handleMeasurementClick(
                            templateItem.img,
                            templateItem.prop as BothGenderSizingTemplateProps,
                          )
                        }
                        onKeyDown={(e) => handleKeyPress(index, e)}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {/* Mobile Actions */}
            <div className="lg:hidden flex justify-end gap-3">
              {isEditable && !isInUse && (
                <AddToJobDropdown
                  templateId={sizingTemplateId}
                  templateGender={gender}
                  templateUnit={unit}
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
                  review={
                    highlighted &&
                    sizingTemplateResult?.metadata?.reviews?.[highlighted]
                      ? sizingTemplateResult.metadata.reviews[highlighted]
                      : undefined
                  }
                />
              )}

              {/* Desktop Actions */}
              <div
                id="tour-buyer-sizing-template-actions"
                className="hidden lg:flex justify-end gap-3"
              >
                {isEditable && !isInUse && (
                  <AddToJobDropdown
                    templateId={sizingTemplateId}
                    templateGender={gender}
                    templateUnit={unit}
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
