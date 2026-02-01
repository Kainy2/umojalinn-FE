"use client";
/**
 * SizingTemplatePill - Reusable component for displaying sizing template status.
 * Handles all states for both buyer and designer views:
 * - No template (red)
 * - Add template (buyer) / Waiting for buyer (designer)
 * - Request measurement points (designer) / Waiting for designer (buyer)
 * - Awaiting submission (designer) / Fill measurements (buyer)
 * - View template (both)
 */





// view sizing template takes to height size modal only when project is not live

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createLucideIcon, File, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
// import { canSendReminder } from "@/lib/sizing-template-utils";
import { DEFAULT_HEIGHT, DEFAULT_UNIT } from "@/types/constants";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";

import { useGetMe } from "@/tanstack/hooks/useUser";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import {
  useGetSizingTemplateById,
  useAddSizingTemplateToProject,
  useCreateSizingTemplate,
  useUpdateSizingTemplate,
  // useSendSizingTemplateReminder,
  useGetAllSizingTemplates,
  useRequestSizingTemplateInProject,
} from "@/tanstack/hooks/useSizingTemplates";

import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import CheckCircle from "@/icons/CheckCircle";
import HeightAndSizeModal from "./HeightAndSizeModal";
import { AcceptBidSizingTemplateInterruptConfirm } from "@/components/custom/dialog/AcceptBidSizingTemplateInterrupt";
import { useQueryClient } from "@tanstack/react-query";
import { BID } from "@/tanstack/keys";
import { useSession } from "next-auth/react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import MenuButton from "../custom/MenuButton";

type SizingTemplatePillProps = {
  projectId: string;
  bidId?: string;
  className?: string;
};

type PillState =
  | "NO_TEMPLATE"
  | "AWAITING_SIZING_TEMPLATE"
  | "ADD_TEMPLATE"
  | "SELECT_MEASUREMENT_POINTS"
  | "AWAITING_MEASUREMENT_FIELDS"
  | "AWAITING_BUYER_MEASUREMENTS"
  | "ADD_REQUESTED_MEASUREMENTS"
  | "VIEW_TEMPLATE"
  | "VIEW_SIZING_RECOMMENDATIONS"
  | "VIEW_PDF";




export const CustomFileQuestion = createLucideIcon("DocumentAlert", [
  [
    "path",
    {
      d: "M20 9.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H14M14 11H8M10 15H8M16 7H8M16.5 15.0022C16.6762 14.5014 17.024 14.079 17.4817 13.81C17.9395 13.5409 18.4777 13.4426 19.001 13.5324C19.5243 13.6221 19.999 13.8942 20.3409 14.3004C20.6829 14.7066 20.87 15.2207 20.8692 15.7517C20.8692 17.2506 18.6209 18 18.6209 18M18.6499 21H18.6599",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ],
]);

const SizingTemplatePill = ({
  projectId,
  bidId,
  className,
}: SizingTemplatePillProps) => {
  const router = useRouter();

  // Data fetching
  const { data: meData, isLoading: isLoadingProfile } = useGetMe();
  const { data: session } = useSession();
  const { data: bidData, refetch: refetchBid, isLoading: isLoadingBid } = useGetBidById(bidId || "", {
    enabled: !!bidId,
  });
  const { data: projectData, refetch: refetchProject, isLoading: isLoadingProject } = useGetProjectById(projectId);
  const queryclient = useQueryClient();

  const project = projectData?.data?.data;
  const bid = bidData?.data?.data;
  const sizingTemplateId = project?.sizingTemplateId;
  
  // For non-bid contexts (like active projects), sizingTemplateRequested might be on the project level
  // If bid exists, use bid.sizingTemplateRequested, otherwise assume true if template exists or project is LIVE
  const sizingTemplateRequested = bid?.sizingTemplateRequested ?? 
    (project?.status === "LIVE" || !!sizingTemplateId);

  const { data: templateData, refetch: refetchTemplate, isLoading: isLoadingTemplate } = useGetSizingTemplateById(
    sizingTemplateId || undefined,
    { enabled: !!sizingTemplateId }
  );
  const { data: allTemplatesData } = useGetAllSizingTemplates();

  const sizingTemplate = templateData?.data?.data;
  const isBuyer = meData?.data?.data?.buyerProfile?.id === project?.buyerId;
  const isDesigner = !isBuyer;

  // State for modals
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UmojaLinnSizingTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [pendingFillNavigation, setPendingFillNavigation] = useState(false);
  // const [reminderPopoverOpen, setReminderPopoverOpen] = useState(false);

  // Cooldown tracking for reminders (runs silently)
  // const [canSend, setCanSend] = useState(true);

  // useEffect(() => {
  //   setCanSend(canSendReminder(sizingTemplate?.lastReminderSentAt));
  //   const interval = setInterval(() => {
  //     setCanSend(canSendReminder(sizingTemplate?.lastReminderSentAt));
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [sizingTemplate?.lastReminderSentAt]);

  // Mutations
  const { mutate: addTemplateToProject, isPending: isAddingTemplate } = useAddSizingTemplateToProject({
    onSuccess: () => {
      setShowHeightModal(false);
      setSelectModalOpen(false);
      setSelectedTemplate(null);
      setIsCreatingNew(false);
      refetchBid();
      refetchProject();
      refetchTemplate();
    },
  });

    // Designer: Request sizing template mutation
    const {
      mutate: requestSizingTemplate,
      // isPending: isRequestingTemplate,
    } = useRequestSizingTemplateInProject({
      onSuccess: () => {
        queryclient.invalidateQueries({ queryKey: [BID, { id: bid?.id, role: session?.user.profileRole }]});  
        
        // Navigate to measurement points selection page after successful request
        navigateToRequestPage()
      },
    });

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

  const { mutate: createTemplate, isPending: isCreatingTemplate } = useCreateSizingTemplate({
    onSuccess: (data) => {
      const newTemplateId = data?.data?.data?.id;
      if (newTemplateId && project?.id) {
        if (pendingFillNavigation) {
          // Navigate to fill page after adding template
          addTemplateToProject(
            { projectId: project.id, sizingTemplateId: newTemplateId },
            {
              onSuccess: () => {
                setPendingFillNavigation(false);
                router.push(
                  `/sizing-templates/${uuidToBase62Safe(newTemplateId)}?projectId=${uuidToBase62Safe(project.id)}`
                );
              },
            }
          );
        } else {
          addTemplateToProject({
            projectId: project.id,
            sizingTemplateId: newTemplateId,
          });
        }
      }
    },
  });

  // const { mutate: sendReminder, isPending: isSendingReminder } = useSendSizingTemplateReminder(
  //   sizingTemplateId || "",
  //   {
  //     onSuccess: () => {
  //       setCanSend(false);
  //       // setReminderPopoverOpen(false);
  //       refetchTemplate();
  //     },
  //   }
  // );

  const isHeightModalLoading = isAddingTemplate || isCreatingTemplate || isUpdatingTemplate;

  // Determine pill state
  const getPillState = (): PillState | null => {
    const requestedMeasurementPoints = sizingTemplate?.requestedMeasurementPoints || bid?.requestedMeasurementPoints;
    const submittedMeasurementPoints = sizingTemplate?.submittedMeasurementPoints

		if (isLoadingTemplate || isLoadingBid || isLoadingProject || isLoadingProfile) return null;

    if (isDesigner) {
      // Designer states
      if (!sizingTemplateId && !sizingTemplateRequested) return "AWAITING_SIZING_TEMPLATE";
      // if (sizingTemplateRequested && !sizingTemplateId) return "AWAITING_SIZING_TEMPLATE";
      if (!requestedMeasurementPoints?.length) return "SELECT_MEASUREMENT_POINTS";
      if (requestedMeasurementPoints?.length && !submittedMeasurementPoints?.length)
        return "AWAITING_BUYER_MEASUREMENTS";
      if (sizingTemplateId && submittedMeasurementPoints?.length) return "VIEW_TEMPLATE";
      if (project?.sizingTemplatePdfUrl && project.status === "COMPLETED") return "VIEW_PDF";

      return "AWAITING_SIZING_TEMPLATE";
    } else {
      // Buyer states
      if (!sizingTemplateId) return "ADD_TEMPLATE";
      if (sizingTemplateId && !requestedMeasurementPoints?.length) return "AWAITING_MEASUREMENT_FIELDS";
      if (sizingTemplateId && requestedMeasurementPoints?.length && !submittedMeasurementPoints?.length)
        return "ADD_REQUESTED_MEASUREMENTS";
      if (sizingTemplateId && requestedMeasurementPoints?.length && submittedMeasurementPoints?.length && sizingTemplate?.metadata?.reviews && Object.values(sizingTemplate?.metadata?.reviews).some(Boolean))
        return "VIEW_SIZING_RECOMMENDATIONS";
      if (sizingTemplateId && submittedMeasurementPoints?.length) return "VIEW_TEMPLATE";
      if (project?.sizingTemplatePdfUrl && project.status === "COMPLETED") return "VIEW_PDF";
    }

    return "NO_TEMPLATE";
  };

  const pillState = getPillState();

  // Handlers
  const handleSelectTemplate = (templateId: string) => {
    const fullTemplate = allTemplatesData?.data?.data?.find((t) => t.id === templateId);
    setSelectedTemplate(fullTemplate || ({ id: templateId } as UmojaLinnSizingTemplate));
    setIsCreatingNew(false);
    setSelectModalOpen(false);
    setShowHeightModal(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsCreatingNew(true);
    setSelectModalOpen(false);
    setShowHeightModal(true);
  };

  const handleHeightSubmit = (
    height: number,
    ukSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplate["unit"]
  ) => {
    if (isCreatingNew && project?.gender) {
      createTemplate({
        name: project?.title || "Project",
        gender: project.gender,
        unit,
        height,
        ukStandardSize: ukSize,
      });
    } else if (selectedTemplate && project?.id) {
      updateTemplate({
        height,
        ukStandardSize: ukSize,
        unit,
      });
    }
  };

  const handleHeightModalChange = (open: boolean) => {
    if (!isHeightModalLoading) {
      setShowHeightModal(open);
      if (!open) {
        setSelectedTemplate(null);
        setIsCreatingNew(false);
        setPendingFillNavigation(false);
      }
    }
  };

  const handleFillMeasurementsClick = () => {
    // For fill measurements state, show modal first then navigate
    setPendingFillNavigation(true);
    setIsCreatingNew(false);
    setSelectedTemplate(sizingTemplate || null);
    // setShowHeightModal(true);
			if (sizingTemplate && project?.id) {
		  	router.push(
					`/sizing-templates/${uuidToBase62Safe(sizingTemplate.id)}?projectId=${uuidToBase62Safe(project.id)}`
				)
			}
  };

  const handleFillHeightSubmit = (
    height: number,
    ukSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplate["unit"]
  ) => {
    if (sizingTemplate && project?.id) {
      // Update template first, then navigate
      updateTemplate(
        { height, ukStandardSize: ukSize, unit },
        {
          onSuccess: () => {
            setShowHeightModal(false);
            setPendingFillNavigation(false);
            router.push(
              `/sizing-templates/${uuidToBase62Safe(sizingTemplate.id)}?projectId=${uuidToBase62Safe(project.id)}`
            );
          },
        }
      );
    }
  };

  // const handleSendReminder = () => {
  //   if (!sizingTemplateId || !project?.id) return;
  //   sendReminder({
  //     projectId: project.id,
  //     reminderType: isBuyer
  //       ? SIZING_TEMPLATE_REMINDER_TYPE.DESIGNER_REMINDER
  //       : SIZING_TEMPLATE_REMINDER_TYPE.BUYER_REMINDER,
  //   });
  // };

  const navigateToRequestPage = () => {
    if (!project?.id) return;

    if (sizingTemplateId){
      router.push(
        `/sizing-templates/${uuidToBase62Safe(sizingTemplateId)}?projectId=${uuidToBase62Safe(project.id)}`
      );
    } else if (bid?.id) {
      router.push(
        `/sizing-templates/request/${uuidToBase62Safe(bid?.id)}`
      );
    }
  };

  const handleRequestTemplate = ()=> {
    if (!project?.id) return;

    if (sizingTemplateRequested) {
      navigateToRequestPage()
    } else {
      requestSizingTemplate(project?.id)
    }
  }
  console.log({ handleRequestTemplate });
  

  const navigateToViewPage = () => {
    if (sizingTemplateId && project?.id) {
      router.push(
        `/sizing-templates/${uuidToBase62Safe(sizingTemplateId)}?projectId=${uuidToBase62Safe(project.id)}`
      );
    }
  };

	const navigateToViewSizingRecommendationsPage = () => {
    if (sizingTemplateId && project?.id) {
      router.push(
        `/sizing-templates/${uuidToBase62Safe(sizingTemplateId)}?projectId=${uuidToBase62Safe(project.id)}`
      );
    }
  };

  const downloadSizingTemplatePdf = () => {
    if (project?.sizingTemplatePdfUrl) {
      window.open(project?.sizingTemplatePdfUrl, "_blank");
    }
  };

  // Get modal values
  const getModalValues = () => {
    if (isCreatingNew) {
      return { height: DEFAULT_HEIGHT, unit: DEFAULT_UNIT, gender: project?.gender };
    }
    if (pendingFillNavigation && sizingTemplate) {
      return {
        height: sizingTemplate.height ?? DEFAULT_HEIGHT,
        ukSize: sizingTemplate.ukStandardSize,
        unit: sizingTemplate.unit ?? DEFAULT_UNIT,
        gender: sizingTemplate.gender ?? project?.gender,
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

  // Render reminder popover
  // const renderReminderPopover = (children: React.ReactNode) => (
  //   <Popover open={reminderPopoverOpen} onOpenChange={setReminderPopoverOpen}>
  //     <PopoverTrigger asChild>{children}</PopoverTrigger>
  //     <PopoverContent align="center" className="w-64 p-0">
	// 				<MenuButton
  //           onClick={handleSendReminder}
	// 					icon={<Bell className="size-4" />}
	// 					disabled={!canSend || isSendingReminder}
	// 					className={cn("bg-gray-50 hover:bg-gray-100", !canSend && "opacity-50 cursor-not-allowed")}
	// 				>
	// 				{isSendingReminder ? "Sending..." : "Send Reminder"}
  //         {!canSend && (
  //           <p className="text-xs text-muted-foreground text-center">
  //             Please wait a while before resending
  //           </p>
  //         )}
	// 				</MenuButton>
  //     </PopoverContent>
  //   </Popover>
  // );
  // pillState = "VIEW_TEMPLATE"
  // Render pill based on state
  const renderPill = () => {
    switch (pillState) {
      case "NO_TEMPLATE":
        // return (
        //   <AvatarIconTag
        //     label="No sizing template"
        //     icon={
        //       <span className="text-white [&>svg]:size-5 size-7 rounded-full bg-error flex items-center justify-center">
        //         <CircleAlert />
        //       </span>
        //     }
        //     disabled
        //     className={className}
        //   />
        // );
      // case "AWAITING_SIZING_TEMPLATE":
      //   // // Designer view - waiting for buyer to add template
      //   return (
      //     <AvatarIconTag
      //     label="Request Sizing Template"
      //     icon={
      //         <span className="text-white [&>svg]:size-5 size-7 rounded-full bg-red-500 flex items-center justify-center">
      //           <Plus />
      //         </span>
      //       }
      //       onClick={handleRequestTemplate}
      //       disabled={!project?.id}
      //       className={cn("cursor-pointer transition-transform hover:scale-[1.02] border border-red-500 border-dashed", className)}
      //     />
      //   );

      case "ADD_TEMPLATE":
        // Buyer view - can add template
        return (
          <div
            onClick={() => setSelectModalOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="Add Sizing Template"
              icon={
                <span className="text-white [&>svg]:size-4 size-7 rounded-full bg-red-500 flex items-center justify-center">
                  <Plus />
                </span>
              }
              className={className}
            />
          </div>
        );

      case "AWAITING_SIZING_TEMPLATE":
        // // Designer view - waiting for buyer to add template
      case "SELECT_MEASUREMENT_POINTS":
        // Designer view - need to select measurement points and request them from buyer
        return (
          <div
            onClick={navigateToRequestPage}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="Request measurement points"
              icon={
                <span className="text-white [&>svg]:size-4 size-7 rounded-full bg-red-500 flex items-center justify-center">
                  <Plus />
                </span>
              }
              className={cn("bg-red-50 border border-red-500", className)}
            />
          </div>
        );

      // case "AWAITING_MEASUREMENT_FIELDS":
      //   // Buyer view - waiting for designer to request measurement points
      //   return renderReminderPopover(
      //     <div className="cursor-pointer transition-transform hover:scale-[1.02]">
      //       <AvatarIconTag
      //         label="Awaiting Measurement Fields"
      //         icon={
      //           <span className="text-white [&>svg]:size-4 size-7 rounded-full bg-red-500 flex items-center justify-center">
      //             <Bell />
      //           </span>
      //         }
      //         className={cn("bg-red-50 border border-red-500", className)}
      //       />
      //     </div>
      //   );

      case "AWAITING_BUYER_MEASUREMENTS":
        // Designer view - waiting for buyer to submit measurements
        return (
          <div 
            // onClick={navigateToRequestPage}
            className="transition-transform opacity-50"
          >
            <AvatarIconTag
              label="Template Requested"
              icon={
                <span className="text-white [&>svg]:size-5 size-7 rounded-full bg-gray-500 flex items-center justify-center ">
                  <Plus />
                </span>
              }
              className={cn("bg-gray-50 border border-gray-500 border-dashed  cursor-not-allowed", className)}
            />
          </div>
        );

      case "ADD_REQUESTED_MEASUREMENTS":
        // Buyer view - need to fill measurement values
        return (
          <div
            onClick={handleFillMeasurementsClick}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="Add Requested Measurements"
              icon={
                <span className="text-white [&>svg]:size-4 size-7 rounded-full bg-red-500 flex items-center justify-center">
                  <Plus  />
                </span>
              }
              className={cn("bg-red-50 border border-red-500", className)}
            />
          </div>
        );

      case "VIEW_SIZING_RECOMMENDATIONS":
        // Buyer view - need to view sizing recommendations that designer sent after submitting measurements
        return (
          <div
            onClick={navigateToViewSizingRecommendationsPage}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="View Sizing Recommendations"
              icon={
                <span className="text-primary [&>svg]:size-5 size-7 rounded-full flex items-center justify-center">
                  <CustomFileQuestion />
                </span>
              }
              className={cn("bg-primary-100 ", className)}
            />
          </div>
        );

      case "AWAITING_MEASUREMENT_FIELDS":
      // Buyer view - waiting for designer to request measurement points
      case "VIEW_TEMPLATE":
			// Template attached - View mode to open height and size modal
				return (
					<div
						className="cursor-pointer transition-transform hover:scale-[1.02]"
						onClick={() => {
              if (!project?.sizingTemplateId) return;
              if (project.status === "ADS") {
                handleSelectTemplate(project?.sizingTemplateId)
                return
              }

              if (project.status === "LIVE") {
                navigateToViewPage()
                return
              }
						}}
					>
						<AvatarIconTag
							label="View sizing template"
							icon={<CheckCircle className="text-success" />}
							disabled={!project?.sizingTemplateId}
						/>
					</div>
				);

      case "VIEW_PDF":
        return (
          <div
            onClick={downloadSizingTemplatePdf}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <AvatarIconTag
              label="View PDF"
              icon={<File className="text-primary" />}
              className={cn("bg-primary-100 ", className)}
            />
          </div>
        );

			// Template attached - View mode to navigate to view page
			// return (
			//   <div
			//     onClick={navigateToViewPage}
			//     className="cursor-pointer transition-transform hover:scale-[1.02]"
			//   >
			//     <AvatarIconTag
			//       label="View sizing template"
			//       icon={<CheckCircle className="text-success" />}
			//       className={className}
			//     />
			//   </div>
			// );

      default:
        return (
					<AvatarIconTag
						label="Loading Status..."
						icon={<Loader2 className="animate-spin" />}
					/>
				);
    }
  };

  return (
    <>
      {renderPill()}

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
        onSubmit={pendingFillNavigation ? handleFillHeightSubmit : handleHeightSubmit}
        disabled={false}
        triggerOpen={showHeightModal}
        onOpenChange={handleHeightModalChange}
        isLoading={isHeightModalLoading}
        gender={modalValues.gender}
      />
    </>
  );
};

export default SizingTemplatePill;

