"use client";
/**
 * AddToJobDropdown - Dropdown to attach sizing template to a project.
 */

import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddSizingTemplateToProject } from "@/tanstack/hooks/useSizingTemplates";
import { UmojaLinnProject } from "@/types/project";

type AddToJobDropdownProps = {
  templateId?: string;
  onSuccess?: () => void;
  disabled?: boolean;
  availableProjects?: UmojaLinnProject[];
  isLoadingProjects?: boolean;
  className?: string;
};

const AddToJobDropdown = ({
  templateId,
  onSuccess,
  disabled = false,
  availableProjects = [],
  isLoadingProjects = false,
  className,
}: AddToJobDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { mutate: addToProject, isPending: isAttaching } = useAddSizingTemplateToProject({
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  const handleSelectProject = (projectId: string) => {
    if (!templateId) return;
    addToProject({ sizingTemplateId: templateId, projectId });
  };

  const isDisabled = disabled || !templateId || isAttaching;
  const hasNoProjects = availableProjects.length === 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isDisabled} className={cn("flex items-center gap-2 min-w-[140px] transition-all duration-200 hover:border-primary hover:text-primary", className)}>
          {isAttaching ? (
            <><Loader2 className="size-4 animate-spin" /><span>Attaching...</span></>
          ) : (
            <><span>Add to Job</span><ChevronDown className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")} /></>
          )}
        </Button>
        <small className="text-xs mt-2 text-red-400">
          Standard Size and Height not available yet
        </small>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[220px] animate-in fade-in-0 zoom-in-95 duration-200">
        {isLoadingProjects && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading projects...</span>
          </div>
        )}
        
        {!isLoadingProjects && hasNoProjects && (
          <div className="py-4 px-2 text-center">
            <Briefcase className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No jobs available</p>
            <p className="text-xs text-muted-foreground mt-1">Create a project first to attach this template</p>
          </div>
        )}
        
        {!isLoadingProjects && !hasNoProjects && (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">Select a project</div>
            {availableProjects.map((project, index) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={cn("cursor-pointer py-2.5 animate-in fade-in slide-in-from-top-1 duration-200 hover:bg-primary/5 focus:bg-primary/5")}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-sm">{project.title || `Project ${index + 1}`}</span>
                  {project.status && <span className="text-xs text-muted-foreground">{project.status}</span>}
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToJobDropdown;
