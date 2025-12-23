"use client";
/**
 * BidTabProjectDetailsSection - Displays project details in bid sidebar.
 * Includes the sizing template pill with different states:
 * - View sizing template (green checkmark) - when template is attached
 * - Add sizing template (yellow alert) - when requested but not attached (clickable)
 * - No sizing template (red alert) - when not requested
 */

import LabelValue from "@/components/custom/LabelValue";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { format } from "date-fns";
import { getCurrencySymbol } from "@/lib/string";
import { CircleAlert, EyeOff, Plus } from "lucide-react";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { Skeleton } from "@/components/ui/skeleton";
import GalleryImages from "@/components/custom/GalleryImages";
import SizingTemplateDialog from "@/components/custom/dialog/SizingTemplate";
import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import CheckCircle from "@/icons/CheckCircle";
import { formatCurrencyValue } from "@/lib/number";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/tanstack/hooks/useUser";
import {
  AcceptBidSizingTemplateInterruptConfirm,
} from "@/components/custom/dialog/AcceptBidSizingTemplateInterrupt";
import {
  useAddSizingTemplateToProject,
  useCreateSizingTemplate,
  useGetAllSizingTemplates,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import HeightAndSizeModal from "@/components/sizing-template/HeightAndSizeModal";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import { uuidToBase62Safe } from "@/lib/uuid";
import { DEFAULT_HEIGHT, DEFAULT_UK_SIZE, DEFAULT_UNIT } from "@/types/constants";

const BidTabProjectDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: bidData, isPending, refetch: refetchBid } = useGetBidById(id);
  const { data: me } = useGetMe();
  const bid = bidData?.data?.data;
  const project = bid?.project;

  // Get all templates to find full template data when selecting
  const { data: liveSizingTemplates } = useGetAllSizingTemplates({ sizingTemplateStatus: "LIVE" });

  // Check if user is buyer
  const isBuyer = me?.data?.data?.buyerProfile?.id === project?.buyerId;

  // Modal states
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UmojaLinnSizingTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Add template to project - closes modal on success
  const { mutate: addTemplateToProject, isPending: isAddingTemplate } = useAddSizingTemplateToProject({
    onSuccess: () => {
      setShowHeightModal(false);
      setSelectModalOpen(false);
      setSelectedTemplate(null);
      setIsCreatingNew(false);
      refetchBid();
      if (project?.id) {
        router.push(`/projects/${uuidToBase62Safe(project.id)}`);
      }
    },
  });

  // Update template with height/ukStandardSize - then add to project
  const { mutate: updateTemplate, isPending: isUpdatingTemplate } = useUpdateSizingTemplate(
    selectedTemplate?.id,
    {
      onSuccess: () => {
        if (selectedTemplate && project?.id) {
          addTemplateToProject({
            projectId: project.id,
            sizingTemplateId: selectedTemplate.id,
          });
        }
      },
    }
  );

  // Create new template - then add to project
  const { mutate: createTemplate, isPending: isCreatingTemplate } = useCreateSizingTemplate({
    onSuccess: (data) => {
      const newTemplateId = data?.data?.data?.id;
      if (newTemplateId && project?.id) {
        addTemplateToProject({
          projectId: project.id,
          sizingTemplateId: newTemplateId,
        });
      }
    },
  });

  const isHeightModalLoading = isAddingTemplate || isCreatingTemplate || isUpdatingTemplate;

  // Handle template selection from modal - find full template data
  const handleSelectTemplate = (templateId: string) => {
    const fullTemplate = liveSizingTemplates?.data?.data?.find(t => t.id === templateId);
    setSelectedTemplate(fullTemplate || { id: templateId } as UmojaLinnSizingTemplate);
    setIsCreatingNew(false);
    setSelectModalOpen(false);
    setShowHeightModal(true);
  };

  // Handle create new template - use defaults
  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsCreatingNew(true);
    setSelectModalOpen(false);
    setShowHeightModal(true);
  };

  // Handle height/size submission
  // For existing templates: First update with height/ukSize, then add to project
  // For new templates: Create with all values, then add to project
  const handleHeightSubmit = (height: number, ukSize: UmojalinnStandardSize) => {
    if (isCreatingNew && project?.gender) {
      createTemplate({
        name: `${project?.title || "Project"}`,
        gender: project?.gender,
        unit: "CM",
        height: height,
        ukStandardSize: ukSize,
      });
    } else if (selectedTemplate && project?.id) {
      // First update the template with height and ukStandardSize
      updateTemplate({
        height: height,
        ukStandardSize: ukSize,
      });
    }
  };

  // Handle modal close - only allow if not loading
  const handleHeightModalChange = (open: boolean) => {
    if (!isHeightModalLoading) {
      setShowHeightModal(open);
      if (!open) {
        setSelectedTemplate(null);
        setIsCreatingNew(false);
      }
    }
  };

  // Get modal values based on selection mode
  const getModalValues = () => {
    if (isCreatingNew) {
      return { height: DEFAULT_HEIGHT, ukSize: DEFAULT_UK_SIZE, unit: DEFAULT_UNIT };
    }
    return {
      height: selectedTemplate?.height ?? DEFAULT_HEIGHT,
      ukSize: selectedTemplate?.ukStandardSize ?? DEFAULT_UK_SIZE,
      unit: selectedTemplate?.unit ?? DEFAULT_UNIT,
    };
  };

  const modalValues = getModalValues();

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-20" />
        <div className="flex flex-col gap-3">
          {new Array(2).fill("").map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
          <Skeleton className="h-4 w-3/4" />
        </div>
        {new Array(4).fill("").map((_, i) => (
          <div className="" key={i}>
            <Skeleton className="h-3 mb-2 w-32 " />
            <Skeleton className="h-5 w-52 " />
          </div>
        ))}
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-2 w-40 mb-4" />
          <Skeleton className="aspect-square max-w-64" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <p className="h-40 flex items-center justify-center text-gray-400">
        No project to display
      </p>
    );
  }

  // Render sizing template pill
  const renderSizingTemplatePill = () => {
    // Template attached - View mode
    if (project?.sizingTemplateId) {
      return (
        <SizingTemplateDialog id={project?.sizingTemplateId}>
          <AvatarIconTag
            label="View sizing template"
            icon={<CheckCircle className="text-success" />}
          />
        </SizingTemplateDialog>
      );
    }

    // Template requested but not attached - Add mode (clickable for buyers)
    if (bid?.sizingTemplateRequested) {
      if (isBuyer) {
        return (
          <div
            onClick={() => setSelectModalOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="Add sizing template"
              icon={
                <span className="text-white [&>svg]:size-4 size-7 rounded-full bg-primary flex items-center justify-center">
                  <Plus />
                </span>
              }
            />
          </div>
        );
      }
      // Designer view - just show requested status
      return (
        <AvatarIconTag
          label="Sizing template requested"
          icon={
            <span className="text-white [&>svg]:size-5 size-7 rounded-full bg-primary flex items-center justify-center">
              <CircleAlert />
            </span>
          }
          disabled
        />
      );
    }

    // No template requested
    return (
      <AvatarIconTag
        label="No sizing template"
        icon={
          <span className="text-white [&>svg]:size-5 size-7 rounded-full bg-error flex items-center justify-center">
            <CircleAlert />
          </span>
        }
        disabled
      />
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="relative bg-stone-100 border-l-4 border-stone-600 p-4">
        {project.projectType === "PRIVATE" && (
          <span className="absolute rounded-full p-2 [&>svg]:size-5 text-primary bg-background top-2 right-2">
            <EyeOff />
          </span>
        )}
        <p className="text-sm">Project Budget</p>
        <p className="text-lg font-semibold truncate">
          {getCurrencySymbol(project?.currency)}
          {formatCurrencyValue(project?.budget)}
        </p>
      </div>
      <p className="mb-2">{project?.about}</p>
      <LabelValue
        label="Delivery location"
        value={[
          project?.deliveryAddress?.state || "",
          project?.deliveryAddress?.country || "",
        ]}
      />
      <LabelValue
        label="Project deadline"
        value={
          project?.dueDate ? format(project?.dueDate, "dd MMM, yyyy") : "None"
        }
      />

      <div className="items-center gap-2">
        <p className="text-foreground-body text-sm mb-2">
          Will buyer provide materials?
        </p>
        <div
          className={cn(
            "mb-2 font-semibold text-subtitle-2",
            bid.project.willProvideMaterials ? "text-green-500" : "text-red-600"
          )}
        >
          {bid.project.willProvideMaterials ? "Yes" : "No"}
        </div>
      </div>

      <LabelValue
        label="Clothing types"
        value={project?.clothingTypes?.map((type) => type?.name) || "None"}
      />
      <LabelValue
        label="Additional note"
        value={project?.additionalNotes || "None"}
      />

      {/* Sizing Template Pill */}
      <span>{renderSizingTemplatePill()}</span>

      {/* Select Sizing Template Modal */}
      <AcceptBidSizingTemplateInterruptConfirm
        loadingCreate={isCreatingTemplate}
        open={selectModalOpen}
        loading={isAddingTemplate}
        onOpenChange={setSelectModalOpen}
        handleCreateNewSizingTemplate={handleCreateNew}
        handleAddSizingTemplateToProject={handleSelectTemplate}
      />

      {/* Height and Size Modal */}
      <HeightAndSizeModal
        height={modalValues.height}
        ukSize={modalValues.ukSize}
        unit={modalValues.unit}
        onSubmit={handleHeightSubmit}
        disabled={false}
        triggerOpen={showHeightModal}
        onOpenChange={handleHeightModalChange}
        isLoading={isHeightModalLoading}
      />

      <div>
        <h3 className="mb-2 font-semibold text-subtitle-2">
          Styling Inspirations
        </h3>
        <p className="text-sm mb-4 text-foreground-body">
          Snapshots of your work
        </p>
        {project?.Gallery ? (
          <GalleryImages
            height={100}
            width={100}
            images={project.Gallery}
            wrapperClassName="aspect-square w-full h-auto"
          />
        ) : (
          <Image
            src="/img/svg/null.svg"
            alt=""
            height={500}
            width={500}
            className="w-full col-span-2 aspect-square object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default BidTabProjectDetailsSection;
