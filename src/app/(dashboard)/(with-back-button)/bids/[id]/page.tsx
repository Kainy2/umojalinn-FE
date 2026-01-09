"use client";
/**
 * IndividualBidPage - View bid details and accept/reject.
 * 
 * Accept Proposal Flow:
 * 1. If sizing template already attached: Accept bid directly
 * 2. If no template: Show sizing template selection modal
 *    - Select existing template -> Open Height/Size modal with template values -> Accept bid
 *    - Create new template -> Open Height/Size modal with defaults -> Create template -> Accept bid
 */

import Alert from "@/components/custom/Alert";
import { VariableDeliverySelect } from "@/components/custom/bids/VariableDeliverySelect";
import AcceptBidSizingTemplateInterrupt, {
  AcceptBidSizingTemplateInterruptConfirm,
} from "@/components/custom/dialog/AcceptBidSizingTemplateInterrupt";
import DeliveryMethodPicker from "@/components/custom/picker/DeliveryMethod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import PragraphSpacing from "@/icons/PragraphSpacing";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { uuidToBase62Safe } from "@/lib/uuid";
import RejectButton from "@/section/dashboard/project/bid/button/Reject";
import { useAcceptOrRejectBid, useGetBidById } from "@/tanstack/hooks/useBid";
import { useAddSizingTemplateToProject, useCreateSizingTemplate, useGetAllSizingTemplates, useUpdateSizingTemplate } from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { EDeliveryMileStoneType } from "@/types/enum";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import HeightAndSizeModal from "@/components/sizing-template/HeightAndSizeModal";
import { UmojaLinnSizingTemplate, UmojalinnStandardSize } from "@/types/project";
import { DEFAULT_HEIGHT, DEFAULT_UK_SIZE, DEFAULT_UNIT } from "@/types/constants";

const IndividualBidPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData, isPending: isLoadingBid } = useGetBidById(id);
  const bid = bidData?.data?.data;
  const { data: meData } = useGetMe();
  const router = useRouter();
  const { data: session } = useSession();

  const isDesigner = session?.user.profileRole === "DESIGNER";
  const note = session?.user?.profileRole === "BUYER" ? bid?.additionalNotesToClient : bid?.rejectionReason;
  const myNote = session?.user?.profileRole === "BUYER" ? bid?.rejectionReason : bid?.additionalNotesToClient;

  // Get all templates to find full template data when selecting
  const { data: liveSizingTemplates } = useGetAllSizingTemplates({ sizingTemplateStatus: "LIVE" });


  // Modal states
  const [interruptOpen, setInterruptOpen] = useState<"INTERRUPT" | "SELECT" | null>(null);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [selectedTemplateForAccept, setSelectedTemplateForAccept] = useState<UmojaLinnSizingTemplate | null>(null);
  const [isCreatingNewForAccept, setIsCreatingNewForAccept] = useState(false);
  const [shouldSubmitNavigate, setShouldSubmitNavigate] = useState(false);

  // Accept/Reject mutation
  const { mutate: acceptOrReject, isPending } = useAcceptOrRejectBid(id, {
    onSuccess() {
      setShouldSubmitNavigate(false);
      router.push(`/projects/${uuidToBase62Safe(bid?.projectId || "")}`);
    },
  });

  // Add template to project - closes modal and accepts bid on success
  const { mutate: addSizingTemplateToProject, isPending: isAddingSizingTemplateToProject } = useAddSizingTemplateToProject({
    onSuccess() {
      setInterruptOpen(null);
      setShowHeightModal(false);
      setSelectedTemplateForAccept(null);
      setIsCreatingNewForAccept(false);
      if (shouldSubmitNavigate) {
        // acceptOrReject({ status: "ACCEPTED" });
      }
    },
  });

  // Update template with height/ukStandardSize - then add to project
  const { mutate: updateTemplate, isPending: isUpdatingTemplate } = useUpdateSizingTemplate(
    selectedTemplateForAccept?.id,
    {
      onSuccess: () => {        
        if (selectedTemplateForAccept && bid?.projectId) {
          addSizingTemplateToProject({
            projectId: bid.projectId,
            sizingTemplateId: selectedTemplateForAccept.id,
          });
        }
      },
    }
  );

  // Create new template - then add to project
  const { mutate: createTemplate, isPending: isCreatingTemplate } = useCreateSizingTemplate({
    onSuccess: (data) => {
      const newTemplateId = data?.data?.data?.id;
      if (newTemplateId && bid?.projectId) {
        addSizingTemplateToProject({
          projectId: bid.projectId,
          sizingTemplateId: newTemplateId,
        });
      }
    },
  });

  const isHeightModalLoading = isAddingSizingTemplateToProject || isCreatingTemplate || isUpdatingTemplate;

  // Handle template selection from modal - find full template data
  const handleSelectTemplateForAccept = (templateId: string) => {
    const fullTemplate = liveSizingTemplates?.data?.data?.find(t => t.id === templateId);
    setSelectedTemplateForAccept(fullTemplate || { id: templateId } as UmojaLinnSizingTemplate);
    setIsCreatingNewForAccept(false);
    setInterruptOpen(null);
    setShowHeightModal(true);
    setShouldSubmitNavigate(true);
  };

  // Handle create new template from modal - use defaults
  const handleCreateNewForAccept = () => {
    setSelectedTemplateForAccept(null);
    setIsCreatingNewForAccept(true);
    setInterruptOpen(null);
    setShowHeightModal(true);
  };

  // Handle height/size submission
  // For existing templates: First update with height/ukSize, then add to project
  // For new templates: Create with all values, then add to project
  const handleHeightSubmit = (height: number, ukStandardSize: UmojalinnStandardSize, unit: UmojaLinnSizingTemplate["unit"]) => {
    if (isCreatingNewForAccept) {
      createTemplate({
        name: bid?.project?.title || "Project",
        gender: bid?.project?.gender || "MALE",
        unit,
        height,
        ukStandardSize,
      });
    } else if (selectedTemplateForAccept && bid?.projectId) {
      // First update the template with height and ukStandardSize
      updateTemplate({
        height,
        ukStandardSize,
        unit,
      });
    }
  };

  // Handle modal close - only allow if not loading
  const handleHeightModalChange = (open: boolean) => {
    if (!isHeightModalLoading) {
      setShowHeightModal(open);
      if (!open) {
        setSelectedTemplateForAccept(null);
        setIsCreatingNewForAccept(false);
        setShouldSubmitNavigate(false);
      }
    }
  };

  // Handle Accept Proposal click
  const handleAcceptProposal = () => {
    if (bid?.project?.sizingTemplateId) {
      acceptOrReject({ status: "ACCEPTED" });
    } else {
      setShouldSubmitNavigate(true);
      setInterruptOpen("INTERRUPT");
    }
  };

  // Get modal values based on selection mode
  const getModalValues = () => {
    if (isCreatingNewForAccept) {
      return { height: DEFAULT_HEIGHT, ukSize: DEFAULT_UK_SIZE, unit: DEFAULT_UNIT };
    }
    return {
      height: selectedTemplateForAccept?.height ?? DEFAULT_HEIGHT,
      ukSize: selectedTemplateForAccept?.ukStandardSize ?? DEFAULT_UK_SIZE,
      unit: selectedTemplateForAccept?.unit ?? DEFAULT_UNIT,
    };
  };

  const modalValues = getModalValues();

  if (isLoadingBid) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton key={i} className="h-44 bg-gray-200" />
        ))}
      </div>
    );
  }

  const isBuyerAndPending = meData?.data?.data?.buyerProfile?.id === bid?.project?.buyerId && bid?.status === "PENDING";
  const isProcessing = isPending || isAddingSizingTemplateToProject || isCreatingTemplate;

  return (
    <div className="flex flex-col gap-4">
      {/* Designer/Buyer Notes */}
      {note && (
        <Alert
          title={session?.user?.profileRole === "BUYER" ? "Designer's Note" : "Buyer's Note"}
          message={note || ""}
          type="error"
        />
      )}

      {/* Milestones */}
      {bid?.milestones?.map((milestone, index) => (
        <div className="card p-8" key={index}>
          <div className="flex gap-1 items-center mb-2 text-subtitle-2">
            <PragraphSpacing />
            <h3 className="leading-none font-semibold">{milestone?.title}</h3>
          </div>
          <p className="text-sm mb-4">{milestone?.description}</p>
          <div className="text-subtitle-2 font-semibold flex justify-between">
            <p>Milestone payment</p>
            <p>
              {getCurrencySymbol(bid?.project?.currency)}
              {formatCurrencyValue(milestone?.amount)}
            </p>
          </div>
        </div>
      ))}

      {/* Delivery Milestone */}
      <div className="card p-8">
        <div className="text-gray-400">
          <h3 className="mb-2 font-semibold text-subtitle-1">Delivery Milestone</h3>
          <h3 className="mb-2 font-semibold">
            {[bid?.project?.deliveryAddress?.state, bid?.project?.deliveryAddress?.country]?.filter((val) => !!val)?.join(", ")}
          </h3>
          <p className="text-sm mb-4">
            {isDesigner
              ? "The Client's full address will be shown once the project is Active"
              : "Your full address will be shown to your designer once the project is active"}
          </p>
          <VariableDeliverySelect selectedDeliveryType={bid?.deliveryMilestone.deliveryMileStoneType || EDeliveryMileStoneType.FIXED} />
        </div>
        <DeliveryMethodPicker value={bid?.deliveryMilestone?.deliveryMethod || ""} disabled />
        <div className="text-subtitle-2 font-semibold flex justify-between">
          <p>Milestone payment</p>
          <p>
            {getCurrencySymbol(bid?.project?.currency)} {formatCurrencyValue(bid?.deliveryMilestone?.amount)}
          </p>
        </div>
      </div>

      {/* Budget */}
      <p className="text-subtitle-2 font-semibold text-foreground text-right mt-8">
        <span className="text-foreground-body">Budget</span> {getCurrencySymbol(bid?.project?.currency)}
        {formatCurrencyValue(bid?.amount)}
      </p>

      {/* Accept/Reject Buttons */}
      {isBuyerAndPending && (
        <>
          <Separator />
          <div className="flex gap-4 justify-end">
            <RejectButton bidId={id} />
            <Button variant="success" loading={isProcessing} onClick={handleAcceptProposal}>
              Accept proposal
            </Button>
          </div>
        </>
      )}

      {/* My rationale */}
      {myNote && <Alert title="Your rationale" message={myNote || ""} type="error" />}

      {/* Sizing Template Required Modal */}
      <AcceptBidSizingTemplateInterrupt
        pendingConfirm={false}
        open={interruptOpen === "INTERRUPT"}
        onConfirm={() => setInterruptOpen("SELECT")}
        onOpenChange={(value) => setInterruptOpen(value ? "INTERRUPT" : null)}
      />

      {/* Select Sizing Template Modal */}
      <AcceptBidSizingTemplateInterruptConfirm
        loadingCreate={isCreatingTemplate}
        open={interruptOpen === "SELECT"}
        loading={isAddingSizingTemplateToProject}
        onOpenChange={(value) => setInterruptOpen(value ? "SELECT" : null)}
        handleCreateNewSizingTemplate={handleCreateNewForAccept}
        handleAddSizingTemplateToProject={handleSelectTemplateForAccept}
      />

      {/* Height and Size Modal - for accept proposal flow */}
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
    </div>
  );
};

export default IndividualBidPage;
