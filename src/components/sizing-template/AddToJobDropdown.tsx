"use client";
/**
 * AddToJobDropdown - Dropdown to attach sizing template to a project.
 */

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAddSizingTemplateToProject,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import {
  UmojaLinnProject,
  UmojaLinnSizingTemplate,
  UmojalinnStandardSize,
} from "@/types/project";
import {
  getClearedSizingTemplatePayload,
  getOppositeGenderProjectWarningDescription,
  isMatchingSizingGender,
  TSizingGender,
} from "@/lib/sizing-template-utils";
import OppositeGenderSizingWarning from "@/components/custom/dialog/OppositeGenderSizingWarning";
import HeightAndSizeModal from "./HeightAndSizeModal";
import { DEFAULT_HEIGHT, DEFAULT_UNIT } from "@/constant";

type AddToJobDropdownProps = {
  templateId?: string;
  templateGender?: TSizingGender;
  templateUnit?: UmojaLinnSizingTemplate["unit"];
  onSuccess?: () => void;
  disabled?: boolean;
  availableProjects?: UmojaLinnProject[];
  isLoadingProjects?: boolean;
  className?: string;
};

const AddToJobDropdown = ({
  templateId,
  templateGender,
  templateUnit = DEFAULT_UNIT,
  onSuccess,
  disabled = false,
  availableProjects = [],
  isLoadingProjects = false,
  className,
}: AddToJobDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGenderWarning, setShowGenderWarning] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [conversionProjectId, setConversionProjectId] = useState<string | null>(
    null,
  );

  const { mutate: addToProject, isPending: isAttaching } =
    useAddSizingTemplateToProject({
      onSuccess: () => {
        setIsOpen(false);
        setShowHeightModal(false);
        setConversionProjectId(null);
        onSuccess?.();
      },
    });

  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateSizingTemplate(templateId);

  const attachToProject = (projectId: string) => {
    if (!templateId) return;
    addToProject({ sizingTemplateId: templateId, projectId });
  };

  const handleSelectProject = (project: UmojaLinnProject) => {
    if (!templateId) return;

    if (
      templateGender &&
      project.gender &&
      !isMatchingSizingGender(templateGender, project.gender)
    ) {
      setPendingProjectId(project.id);
      setShowGenderWarning(true);
      return;
    }
    attachToProject(project.id);
  };

  const pendingProject = availableProjects.find(
    (project) => project.id === pendingProjectId,
  );
  const conversionProject = availableProjects.find(
    (project) => project.id === conversionProjectId,
  );

  const genderWarningDescription =
    pendingProject?.gender && templateGender
      ? getOppositeGenderProjectWarningDescription(
          pendingProject.gender,
          templateGender,
        )
      : "";

  const handleHeightSubmit = (
    height: number,
    ukSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplate["unit"],
  ) => {
    if (!conversionProject?.gender || !conversionProjectId) return;

    updateTemplate(
      {
        ...getClearedSizingTemplatePayload(conversionProject.gender),
        height,
        ukStandardSize: ukSize,
        unit,
      },
      {
        onSuccess: () => {
          attachToProject(conversionProjectId);
        },
      },
    );
  };

  const isBusy = isAttaching || isUpdatingTemplate;
  const isDisabled = disabled || !templateId || isBusy;
  const hasNoProjects = availableProjects.length === 0;

  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={isDisabled ? undefined : setIsOpen}
      >
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col w-36">
            <Button
              variant="outline"
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-2 h-8 rounded-md min-w-[100px] transition-all duration-200 hover:border-primary hover:text-primary",
                className,
              )}
            >
              {isBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Attaching...</span>
                </>
              ) : (
                <>
                  <span>Add to Job</span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </>
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[220px] animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {isLoadingProjects && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading projects...
              </span>
            </div>
          )}

          {!isLoadingProjects && hasNoProjects && (
            <div className="py-4 px-2 text-center">
              <Briefcase className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No jobs available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a project first to attach this template
              </p>
            </div>
          )}

          {!isLoadingProjects && !hasNoProjects && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                Select a project
              </div>
              {availableProjects.map((project, index) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className={cn(
                    "cursor-pointer py-2.5 animate-in fade-in slide-in-from-top-1 duration-200 hover:bg-primary/5 focus:bg-primary/5",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">
                      {project.title || `Project ${index + 1}`}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <OppositeGenderSizingWarning
        open={showGenderWarning}
        onOpenChange={setShowGenderWarning}
        description={genderWarningDescription}
        pendingConfirm={isBusy}
        onConfirm={() => {
          if (pendingProjectId) {
            setConversionProjectId(pendingProjectId);
            setPendingProjectId(null);
            setShowGenderWarning(false);
            setIsOpen(false);
            setShowHeightModal(true);
            return;
          }
          setShowGenderWarning(false);
        }}
      />

      <HeightAndSizeModal
        height={DEFAULT_HEIGHT}
        unit={templateUnit}
        onSubmit={handleHeightSubmit}
        disabled={false}
        triggerOpen={showHeightModal}
        onOpenChange={(open) => {
          if (!isBusy) {
            setShowHeightModal(open);
            if (!open) setConversionProjectId(null);
          }
        }}
        isLoading={isBusy}
        gender={conversionProject?.gender}
      />
    </>
  );
};

export default AddToJobDropdown;
