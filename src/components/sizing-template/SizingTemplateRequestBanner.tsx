"use client";
/**
 * SizingTemplateRequestBanner
 * Banner shown to buyers when designer has requested a sizing template.
 * Contains dropdown to select and accept a template.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { UmojaLinnSizingTemplate } from "@/types/project";
import AcceptSizingTemplateDropdown from "./AcceptSizingTemplateDropdown";

type SizingTemplateRequestBannerProps = {
  /** Designer who requested the template */
  designerName?: string;
  /** Available templates to choose from */
  availableTemplates?: UmojaLinnSizingTemplate[];
  /** Whether templates are loading */
  isLoadingTemplates?: boolean;
  /** Callback when template is accepted */
  onAccept?: (templateId: string, height: number, ukSize: string) => void;
  /** Whether accepting is in progress */
  isAccepting?: boolean;
  className?: string;
};

const SizingTemplateRequestBanner = ({
  designerName = "The designer",
  availableTemplates = [],
  isLoadingTemplates = false,
  onAccept,
  isAccepting = false,
  className,
}: SizingTemplateRequestBannerProps) => {
  return (
    <div
      className={cn(
        "bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-4",
        "animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="size-10 shrink-0 flex items-center justify-center bg-amber-100 rounded-full">
          <FileText className="size-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground-body">
            Sizing Template requested
          </p>
          <p className="text-sm text-muted-foreground">
            {designerName} does not have your measurement. It is required for the bidding process. You may choose from one of your measurement templates or create a new one.
          </p>
        </div>
      </div>
      
      <AcceptSizingTemplateDropdown
        availableTemplates={availableTemplates}
        isLoading={isLoadingTemplates}
        onAccept={onAccept}
        isAccepting={isAccepting}
      />
    </div>
  );
};

export default SizingTemplateRequestBanner;

