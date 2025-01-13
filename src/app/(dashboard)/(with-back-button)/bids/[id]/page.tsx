"use client";
import Alert from "@/components/custom/Alert";
import AcceptBidSizingTemplateInterrupt, {
  AcceptBidSizingTemplateInterruptConfirm,
} from "@/components/custom/dialog/AcceptBidSizingTemplateInterrupt";
import SizingTemplateDialog from "@/components/custom/dialog/SizingTemplate";
import DeliveryMethodPicker from "@/components/custom/picker/DeliveryMethod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import PragraphSpacing from "@/icons/PragraphSpacing";
import { getCurrencySymbol } from "@/lib/string";
import RejectButton from "@/section/dashboard/project/bid/button/Reject";
import { useAcceptOrRejectBid, useGetBidById } from "@/tanstack/hooks/useBid";
import { useAddSizingTemplateToProject } from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const IndividualBidPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData, isPending: isLoadingBid } = useGetBidById(id);
  const bid = bidData?.data?.data;
  const { data: meData } = useGetMe();
  const router = useRouter();
  const { mutate: acceptOrReject } = useAcceptOrRejectBid(id, {
    onSuccess() {
      router.push(`/projects/${bid?.projectId || ""}`);
    },
  });

  const [interruptOpen, setInterruptOpen] = useState<
    "INTERRUPT" | "SELECT" | null
  >(null);
  const [createSizingTemplateOpen, setCreateSizingTemplateOpen] =
    useState(false);

  const {
    mutate: addSizingTemplateToProject,
    isPending: isAddingSizingTemplateToProject,
  } = useAddSizingTemplateToProject({
    onSuccess() {
      setInterruptOpen(null);
      acceptOrReject({
        status: "ACCEPTED",
      });
    },
  });

  if (isLoadingBid) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton key={i} className="h-44 bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* budget Alert here */}
      {bid?.additionalNotesToClient && (
        <Alert
          title="Designer's note"
          message={bid?.additionalNotesToClient}
          type="error"
        />
      )}
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
              {milestone?.amount}
            </p>
          </div>
        </div>
      ))}
      <div className="card p-8">
        <div className="text-gray-400">
          <h3 className="mb-2 font-semibold  text-subtitle-1">
            Delivery Milestone
          </h3>
          <h3 className="mb-2 font-semibold">
            {[
              bid?.project?.deliveryAddress?.state,
              bid?.project?.deliveryAddress?.country,
            ]
              ?.filter((val) => !!val)
              ?.join(", ")}
          </h3>
          <p className="text-sm mb-4">
            The complete location information of the client will be made
            available at the commencement of the project.
          </p>
        </div>
        <DeliveryMethodPicker
          value={bid?.deliveryMilestone?.deliveryMethod || ""}
          disabled
        />
        <div className="text-subtitle-2 font-semibold flex justify-between">
          <p>Milestone payment</p>
          <p>
            {getCurrencySymbol(bid?.project?.currency)}{" "}
            {bid?.deliveryMilestone?.amount}
          </p>
        </div>
      </div>
      <p className="text-subtitle-2 font-semibold text-foreground text-right mt-8">
        <span className="text-foreground-body">Buget</span>{" "}
        {getCurrencySymbol(bid?.project?.currency)}
        {bid?.amount}
      </p>
      {meData?.data?.data?.buyerProfile?.id === bid?.project?.buyerId &&
        bid?.status === "PENDING" && (
          <>
            <Separator />
            <div className="flex gap-4 justify-end">
              <RejectButton bidId={id} />
              <Button
                variant="success"
                onClick={() => {
                  if (bid?.project?.sizingTemplateId) {
                    acceptOrReject({
                      status: "ACCEPTED",
                    });
                  } else {
                    setInterruptOpen("INTERRUPT");
                  }
                }}
              >
                Accept proposal
              </Button>
            </div>
          </>
        )}
      <AcceptBidSizingTemplateInterrupt
        open={interruptOpen === "INTERRUPT"}
        onConfirm={() => setInterruptOpen("SELECT")}
        onOpenChange={(value) => setInterruptOpen(value ? "INTERRUPT" : null)}
      />
      <AcceptBidSizingTemplateInterruptConfirm
        open={interruptOpen === "SELECT"}
        loading={isAddingSizingTemplateToProject}
        onOpenChange={(value) => setInterruptOpen(value ? "SELECT" : null)}
        handleCreateNewSizingTemplate={() => setCreateSizingTemplateOpen(true)}
        handleAddSizingTemplateToProject={(templateId) => {
          addSizingTemplateToProject({
            projectId: bid?.projectId || "",
            sizingTemplateId: templateId,
          });
        }}
      />
      <SizingTemplateDialog
        open={createSizingTemplateOpen}
        onOpenChange={setCreateSizingTemplateOpen}
      />
    </div>
  );
};

export default IndividualBidPage;
