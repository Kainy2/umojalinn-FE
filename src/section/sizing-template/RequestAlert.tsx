"use client";
/**
 * RequestSizingTemplateAlert - Banner for sizing templates on bid page.
 * - Designers: "Missing Sizing Template" banner to request from buyer
 * - Buyers: "Sizing Template requested" banner with dropdown to add/create template
 */

import { Button } from "@/components/ui/button";
import NotificationBox from "@/icons/NotificationBox";
import { cn } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import {
  useRequestSizingTemplateInProject,
  useAddSizingTemplateToProject,
  useGetAllSizingTemplates,
  useCreateSizingTemplate,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import HeightAndSizeModal from "@/components/sizing-template/HeightAndSizeModal";
import {
  UmojaLinnSizingTemplate,
  UmojaLinnSizingTemplateUnit,
  UmojalinnStandardSize,
} from "@/types/project";
import {
  DEFAULT_HEIGHT,
  DEFAULT_UNIT,
} from "@/types/constants";
import { useQueryClient } from "@tanstack/react-query";
import { BID, PROJECT, SIZING_TEMPLATE } from "@/tanstack/keys";
import { useSession } from "next-auth/react";

const RequestSizingTemplateAlert = () => {
  const FREE_TEMPLATE_LIMIT = 3;
  // id here is bid id
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: bidData, refetch: refetchBid } = useGetBidById(id);
  const { data: me } = useGetMe();
  const { data: session } = useSession();
  const queryclient = useQueryClient();

  const bid = bidData?.data?.data;
  const project = bid?.project;

  // Designer: Request sizing template mutation
  const {
    mutate: requestSizingTemplate,
    isPending: isRequestingTemplate,
    isSuccess: requestSuccess,
  } = useRequestSizingTemplateInProject({
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: [BID, { id: bid?.id, role: session?.user.profileRole }],
      });
      queryclient.invalidateQueries({ queryKey: [PROJECT] });
      queryclient.invalidateQueries({ queryKey: [SIZING_TEMPLATE] });
      // Navigate to measurement points selection page after successful request since template hasnt been added
      if (project?.id && id) {
        router.push(`/sizing-templates/request/${uuidToBase62Safe(id)}`);
      }
    },
  });

  // Buyer: Get LIVE templates not in use
  const { data: templatesData, isLoading: isLoadingTemplates } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: ["LIVE", "DRAFT"],
    });
  const availableTemplates = templatesData?.data.data ?? [];
  // useMemo(() => templatesData?.data?.data?.filter(
  //     (t: UmojaLinnSizingTemplate) => t.status === "LIVE"
  // ) ?? [], [templatesData]);

  // Get total template count to check limit
  const { data: allTemplatesData } = useGetAllSizingTemplates();
  const totalTemplateCount = allTemplatesData?.data?.data?.length ?? 0;
  const maxInUseTemplates =
    me?.data?.data?.buyerProfile?.numberOfTemplates ?? FREE_TEMPLATE_LIMIT;
  const canCreateNewTemplate = totalTemplateCount < maxInUseTemplates;

  // State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<UmojaLinnSizingTemplate | null>(null);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Buyer: Add template to project mutation
  const { mutate: addTemplateToProject, isPending: isAddingTemplate } =
    useAddSizingTemplateToProject({
      onSuccess: () => {
        setShowHeightModal(false);
        setSelectedTemplate(null);
        setIsCreatingNew(false);
        refetchBid();
      },
    });

  // Buyer: Update template with height/ukStandardSize - then add to project
  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateSizingTemplate(selectedTemplate?.id, {
      onSuccess: () => {
        if (selectedTemplate && project?.id) {
          addTemplateToProject({
            projectId: project.id,
            sizingTemplateId: selectedTemplate.id,
          });
        }
      },
    });

  // Buyer: Create new template mutation
  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    useCreateSizingTemplate({
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

  const requestSuccessful = requestSuccess || bid?.sizingTemplateRequested;
  const isDesigner = me?.data?.data?.designerProfile?.id === bid?.designerId;
  const isBuyer = me?.data?.data?.buyerProfile?.id === project?.buyerId;
  const isLoading =
    isAddingTemplate || isCreatingTemplate || isUpdatingTemplate;

  // Handle existing template selection - prefill with template values
  const handleSelectTemplate = (template: UmojaLinnSizingTemplate) => {
    setSelectedTemplate(template);
    setIsCreatingNew(false);
    setIsDropdownOpen(false);
    setShowHeightModal(true);
  };

  // Handle "Create new template" selection - use defaults
  const handleCreateNewTemplate = () => {
    setSelectedTemplate(null);
    setIsCreatingNew(true);
    setIsDropdownOpen(false);
    setShowHeightModal(true);
  };

  // Handle height/size submission
  // For existing templates: First update with height/ukSize, then add to project
  // For new templates: Create with all values, then add to project
  const handleHeightSubmit = (
    height: number,
    ukSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplateUnit,
  ) => {
    if (isCreatingNew && project?.gender) {
      createTemplate({
        name: `${project?.title || "Project"}`,
        gender: project?.gender,
        unit: unit,
        height: height,
        ukStandardSize: ukSize,
      });
    } else if (selectedTemplate && project?.id && project.title) {
      // First update the template with height and ukStandardSize
      updateTemplate({
        height: height,
        ukStandardSize: ukSize,
        name: project.title,
      });
    }
  };

  // Handle modal close
  const handleHeightModalChange = (open: boolean) => {
    if (!isLoading) {
      setShowHeightModal(open);
      if (!open) {
        setSelectedTemplate(null);
        setIsCreatingNew(false);
      }
    }
  };

  // Get modal values based on selection mode
  const getModalValues = () => {
    if (isCreatingNew && project?.gender) {
      return {
        height: DEFAULT_HEIGHT,
        unit: DEFAULT_UNIT,
        gender: project?.gender,
      };
    }
    return {
      height: selectedTemplate?.height ?? DEFAULT_HEIGHT,
      ukSize: selectedTemplate?.ukStandardSize,
      unit: selectedTemplate?.unit ?? DEFAULT_UNIT,
      gender: selectedTemplate?.gender ?? project?.gender,
    };
  };

  const modalValues = getModalValues();

  // DESIGNER VIEW
  if (bid && project?.id && !project?.sizingTemplateId && isDesigner) {
    return (
      <div className="flex flex-col lg:flex-row p-3 border rounded-md gap-2 border-yellow-200 bg-yellow-50 lg:items-center mb-8 animate-in fade-in duration-300">
        <span className="size-8 shrink-0 rounded-full bg-yellow-100 text-error flex items-center justify-center">
          <NotificationBox />
        </span>
        <div className="flex flex-1 flex-col lg:flex-row text-sm gap-2 text-error">
          <h3 className="font-bold text-error-700">Missing Sizing Template!</h3>
          <p>
            This project doesn&apos;t include a sizing template. Please request
            to help complete the bidding process
          </p>
        </div>
        <Button
          className={cn(
            "rounded-md",
            requestSuccessful ? "bg-yellow-200" : "bg-error",
          )}
          loading={isRequestingTemplate}
          disabled={requestSuccessful}
          onClick={() => requestSizingTemplate(project?.id)}
        >
          {requestSuccessful ? "Requested" : "Request"}
        </Button>
      </div>
    );
  }

  // BUYER VIEW: Show banner with dropdown
  if (
    bid &&
    project?.id &&
    !project?.sizingTemplateId &&
    bid?.sizingTemplateRequested &&
    isBuyer
  ) {
    return (
      <>
        <div className="flex flex-col lg:flex-row p-3 border rounded-md gap-3 border-yellow-200 bg-yellow-50 lg:items-center mb-8 animate-in fade-in duration-300">
          <span className="size-8 shrink-0 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <NotificationBox />
          </span>
          <div className="flex flex-1 flex-col text-sm">
            <h3 className="font-bold text-foreground-body">
              Sizing Template requested!
            </h3>
            <p className="text-muted-foreground">
              To streamline the bidding process, a sizing template has been
              requested.
            </p>
          </div>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 rounded-md min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    Add Sizing template
                    <ChevronDown
                      className={cn(
                        "size-4 ml-2 transition-transform duration-200",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[220px] animate-in fade-in-0 zoom-in-95 duration-200"
            >
              {isLoadingTemplates && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              )}

              {!isLoadingTemplates &&
                availableTemplates.length === 0 &&
                canCreateNewTemplate && (
                  <DropdownMenuItem
                    onClick={handleCreateNewTemplate}
                    className="cursor-pointer py-2.5 hover:bg-primary/5"
                  >
                    <span className="font-medium text-sm text-primary">
                      + Create new template
                    </span>
                  </DropdownMenuItem>
                )}

              {!isLoadingTemplates &&
                availableTemplates.length === 0 &&
                !canCreateNewTemplate && (
                  <div className="py-3 px-2 text-center text-sm text-muted-foreground">
                    Maximum {maxInUseTemplates} templates reached
                  </div>
                )}

              {!isLoadingTemplates && availableTemplates.length > 0 && (
                <>
                  {availableTemplates.map(
                    (template: UmojaLinnSizingTemplate, index: number) => (
                      <DropdownMenuItem
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="cursor-pointer py-2.5 hover:bg-primary/5"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="font-medium text-sm">
                          {template.name || `Template ${index + 1}`}
                        </span>
                      </DropdownMenuItem>
                    ),
                  )}
                  <DropdownMenuItem
                    onClick={
                      canCreateNewTemplate ? handleCreateNewTemplate : undefined
                    }
                    disabled={!canCreateNewTemplate}
                    className={cn(
                      "cursor-pointer py-2.5 border-t",
                      canCreateNewTemplate
                        ? "hover:bg-primary/5"
                        : "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium text-sm",
                        canCreateNewTemplate
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      + Create new template{" "}
                      {!canCreateNewTemplate && `(${maxInUseTemplates} max)`}
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Height and Size Modal */}
        <HeightAndSizeModal
          height={modalValues.height}
          ukSize={modalValues.ukSize}
          unit={modalValues.unit}
          onSubmit={handleHeightSubmit}
          disabled={false}
          triggerOpen={showHeightModal}
          onOpenChange={handleHeightModalChange}
          isLoading={isLoading}
          gender={modalValues.gender}
        />
      </>
    );
  }

  return null;
};

export default RequestSizingTemplateAlert;
