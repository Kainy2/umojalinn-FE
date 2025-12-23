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
import { UmojaLinnSizingTemplate } from "@/types/project";
import HeightAndSizeModal from "./HeightAndSizeModal";
import { DEFAULT_UK_SIZE } from "@/types/constants";

type AcceptSizingTemplateDropdownProps = {
  /** List of available templates (not in use) */
  availableTemplates?: UmojaLinnSizingTemplate[];
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
  isLoading = false,
  onAccept,
  isAccepting = false,
  className,
}: AcceptSizingTemplateDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UmojaLinnSizingTemplate | null>(null);
  const [showHeightModal, setShowHeightModal] = useState(false);

  const handleSelectTemplate = (template: UmojaLinnSizingTemplate) => {
    setSelectedTemplate(template);
    setIsOpen(false);
    setShowHeightModal(true);
  };

  const handleHeightSubmit = (height: number, ukSize: string) => {
    if (selectedTemplate) {
      onAccept?.(selectedTemplate.id, height, ukSize);
    }
    setShowHeightModal(false);
    setSelectedTemplate(null);
  };

  const hasNoTemplates = availableTemplates.length === 0;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isAccepting}
            className={cn(
              "flex items-center gap-2 min-w-[180px] transition-all duration-200",
              "hover:border-primary hover:text-primary",
              className
            )}
          >
            {isAccepting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Accepting...</span>
              </>
            ) : (
              <>
                <span>Add Sizing Template</span>
                <ChevronDown className={cn(
                  "size-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
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
                No templates available
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
                    "hover:bg-primary/5 focus:bg-primary/5"
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

      {/* Height and Size Modal */}
      {selectedTemplate && (
        <HeightAndSizeModal
          height={selectedTemplate.height ?? 0}
          ukSize={selectedTemplate.ukStandardSize ?? DEFAULT_UK_SIZE}
          unit={selectedTemplate.unit}
          onSubmit={handleHeightSubmit}
          disabled={false}
          triggerOpen={showHeightModal}
          onOpenChange={setShowHeightModal}
        />
      )}
    </>
  );
};

export default AcceptSizingTemplateDropdown;

