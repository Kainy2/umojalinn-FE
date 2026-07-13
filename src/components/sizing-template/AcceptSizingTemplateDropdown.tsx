"use client";
/**
 * AcceptSizingTemplateDropdown
 * Dropdown for buyers to select and accept a sizing template request from designer.
 * Shows list of templates not currently in use.
 */

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import {
  getClearedSizingTemplatePayload,
  getNoMatchingSizingTemplateMessage,
  getOppositeGenderTemplateWarningDescription,
  isMatchingSizingGender,
  TSizingGender,
} from "@/lib/sizing-template-utils";
import OppositeGenderSizingWarning from "@/components/custom/dialog/OppositeGenderSizingWarning";
import HeightAndSizeModal from "./HeightAndSizeModal";
import { DEFAULT_HEIGHT, DEFAULT_UNIT } from "@/constant";
import { useUpdateSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";

type AcceptSizingTemplateDropdownProps = {
  /** List of available templates (not in use) */
  availableTemplates?: UmojaLinnSizingTemplate[];
  /** Project gender for empty-state messaging */
  projectGender?: null | TSizingGender;
  /** Whether templates are being loaded */
  isLoading?: boolean;
  /** Callback when template is accepted with height/size */
  onAccept?: (templateId: string, height: number, ukSize: string) => void;
  /** Whether accepting is in progress */
  isAccepting?: boolean;
  className?: string;
};

const AcceptSizingTemplateDropdown = ({
  availableTemplates = [],
  projectGender,
  isLoading = false,
  onAccept,
  isAccepting = false,
  className,
}: AcceptSizingTemplateDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<UmojaLinnSizingTemplate | null>(null);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showGenderWarning, setShowGenderWarning] = useState(false);
  const [pendingTemplate, setPendingTemplate] =
    useState<UmojaLinnSizingTemplate | null>(null);
  const [isGenderConversion, setIsGenderConversion] = useState(false);

  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateSizingTemplate(selectedTemplate?.id);

  const proceedWithTemplate = (
    template: UmojaLinnSizingTemplate,
    genderConversion = false,
  ) => {
    setSelectedTemplate(template);
    setIsGenderConversion(genderConversion);
    setIsOpen(false);
    setShowHeightModal(true);
  };

  const handleSelectTemplate = (template: UmojaLinnSizingTemplate) => {
    if (
      projectGender &&
      !isMatchingSizingGender(template.gender, projectGender)
    ) {
      setPendingTemplate(template);
      setShowGenderWarning(true);
      return;
    }
    proceedWithTemplate(template);
  };

  const handleHeightSubmit = (
    height: number,
    ukSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplate["unit"],
  ) => {
    if (!selectedTemplate) return;

    const finishAccept = () => {
      onAccept?.(selectedTemplate.id, height, ukSize);
      setShowHeightModal(false);
      setSelectedTemplate(null);
      setIsGenderConversion(false);
    };

    if (isGenderConversion && projectGender) {
      updateTemplate(
        {
          ...getClearedSizingTemplatePayload(projectGender),
          height,
          ukStandardSize: ukSize,
          unit,
        },
        { onSuccess: finishAccept },
      );
      return;
    }

    finishAccept();
  };

  const hasNoTemplates = availableTemplates.length === 0;
  const isBusy = isAccepting || isUpdatingTemplate;

  const modalValues = isGenderConversion
    ? {
        height: DEFAULT_HEIGHT,
        unit: selectedTemplate?.unit ?? DEFAULT_UNIT,
        gender: projectGender ?? selectedTemplate?.gender,
      }
    : {
        height: selectedTemplate?.height ?? 0,
        ukSize: selectedTemplate?.ukStandardSize,
        unit: selectedTemplate?.unit ?? DEFAULT_UNIT,
        gender: selectedTemplate?.gender,
      };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isBusy}
            className={cn(
              "flex items-center gap-2 min-w-[180px] transition-all duration-200",
              "hover:border-primary hover:text-primary",
              className,
            )}
          >
            {isBusy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Accepting...</span>
              </>
            ) : (
              <>
                <span>Add Sizing Template</span>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[250px] animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading templates...
              </span>
            </div>
          )}

          {!isLoading && hasNoTemplates && (
            <div className="py-4 px-2 text-center">
              <FileText className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {getNoMatchingSizingTemplateMessage()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a sizing template first
              </p>
            </div>
          )}

          {!isLoading && !hasNoTemplates && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                Select a template
              </div>
              {availableTemplates.map((template, index) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={cn(
                    "cursor-pointer py-2.5 animate-in fade-in slide-in-from-top-1 duration-200",
                    "hover:bg-primary/5 focus:bg-primary/5",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">
                      {template.name || `Template ${index + 1}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {template.gender} • {template.status}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTemplate && (
        <HeightAndSizeModal
          height={modalValues.height}
          ukSize={"ukSize" in modalValues ? modalValues.ukSize : undefined}
          unit={modalValues.unit}
          onSubmit={handleHeightSubmit}
          disabled={false}
          triggerOpen={showHeightModal}
          onOpenChange={(open) => {
            setShowHeightModal(open);
            if (!open) {
              setSelectedTemplate(null);
              setIsGenderConversion(false);
            }
          }}
          isLoading={isBusy}
          gender={modalValues.gender}
        />
      )}

      <OppositeGenderSizingWarning
        open={showGenderWarning}
        onOpenChange={setShowGenderWarning}
        description={
          pendingTemplate && projectGender
            ? getOppositeGenderTemplateWarningDescription(
                pendingTemplate.gender,
                projectGender,
              )
            : ""
        }
        onConfirm={() => {
          if (pendingTemplate) {
            proceedWithTemplate(pendingTemplate, true);
            setPendingTemplate(null);
          }
          setShowGenderWarning(false);
        }}
      />
    </>
  );
};

export default AcceptSizingTemplateDropdown;
