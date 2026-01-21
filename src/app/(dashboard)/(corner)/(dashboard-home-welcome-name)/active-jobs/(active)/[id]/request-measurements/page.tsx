"use client";
/**
 * Request Measurements Page - Designer selects measurement points to request from buyer
 * Works with or without a template:
 * - With template: Uses template-based API
 * - Without template: Uses bid-based API
 */

import React from "react";
import { useParams, useRouter } from "next/navigation";
import SelectModeView from "@/components/sizing-template/SelectModeView";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { useGetSizingTemplateById } from "@/tanstack/hooks/useSizingTemplates";
import { uuidToBase62Safe } from "@/lib/uuid";
import { MALE_SIZING_TEMPLATE, FEMALE_SIZING_TEMPLATE } from "@/constant/sizingTemplate";

const RequestMeasurementsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: bidData, isPending: isLoadingBid } = useGetBidById(id);

  const bid = bidData?.data?.data;
  const project = bid?.project;
  const sizingTemplateId = project?.sizingTemplateId;

  // Fetch sizing template if it exists
  const { data: templateData, isPending: isLoadingTemplate } = useGetSizingTemplateById(
    sizingTemplateId ? uuidToBase62Safe(sizingTemplateId) : undefined,
    { enabled: !!sizingTemplateId }
  );

  const sizingTemplate = templateData?.data?.data;
  const gender = sizingTemplate?.gender || project?.gender || "MALE";
  const unit = sizingTemplate?.unit || "CM";
  const template = gender === "FEMALE" ? FEMALE_SIZING_TEMPLATE : MALE_SIZING_TEMPLATE;

  if (isLoadingBid || (sizingTemplateId && isLoadingTemplate)) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Project not found</span>
      </div>
    );
  }

  return (
    <SelectModeView
      projectId={uuidToBase62Safe(project.id)}
      bidId={id}
      projectName={project.title ?? undefined}
      buyerName={project.buyer?.user?.firstName}
      gender={gender}
      unit={unit}
      ukStandardSize={sizingTemplate?.ukStandardSize}
      height={sizingTemplate?.height}
      template={template}
      onSuccess={() => {
        // Navigate back to the active job page after successful submission
        router.push(`/active-jobs/${id}`);
      }}
      onUnitChange={(newUnit) => {
        // Unit change is handled within SelectModeView
        console.log("Unit changed to:", newUnit);
      }}
    />
  );
};

export default RequestMeasurementsPage;
