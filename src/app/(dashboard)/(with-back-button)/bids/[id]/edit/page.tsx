"use client";
import Alert from "@/components/custom/Alert";
import MilestoneCard, {
  MileStoneCardFooter,
} from "@/components/custom/milestone/Card";
import DeliveryMethodPicker from "@/components/custom/picker/DeliveryMethod";
import TotalPriceError from "@/components/custom/dialog/TotalPriceError";
import TextAreaField from "@/components/custom/input/TextAreaField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnDeliveryMethod } from "@/types/project";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { formatCurrencyValue } from "@/lib/number";
import { useBidEdit } from "@/hooks/use-bid-edit";
import { VariableDeliverySelect } from "@/components/custom/bids/VariableDeliverySelect";
import { useGetAppConfig } from "@/tanstack/hooks/useUser";
import { StripeStatusModal } from "@/components/custom/dialog/StripeStatusModal";



const BidPage = () => {
  const { data: appConfig } = useGetAppConfig();
  const SERVICE_FEE_PERCENTAGE = appConfig?.data?.data?.platformCommissionRate || 17;
  const {
    bid,
    project,
    handleCancel,
    handleUpdateAction,
    handleAdd,
    handleToggle,
    handleSave,
    handleUpdate,
    handleFinalSubmit,
    milestones,
    totalPrice,
    addNote,
    setAddNote,
    note,
    setNote,
    excess,
    showExcessDialog,
    setShowExcessDialog,
    deliveryMethod,
    setDeliveryMethod,
    deliveryMilestonePrice,
    setDeliveryMilestonePrice,
    mode,
    editMode,
    editing,
    isPending,
    deleteMilestone,
    isUpdatingBid,
    isSubmittingBid,
    isPendingDelete,
    isPendingUpdateBid,
    isPendingCreateBid,
    selectedDeliveryMethodType,
    setSelectedDeliveryMethodType,
    showStripeModal,
    setShowStripeModal,
    paymentStatus,
  } = useBidEdit();

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton key={i} className="h-44 bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!bid) {
    return (
      <p className="h-60 flex items-center justify-center text-gray-400">
        No bid available
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {bid?.rejectionReason && (
        <Alert
          type="error"
          title="Client's note"
          message={bid?.rejectionReason}
        />
      )}
      {milestones.map((milestone, index) => (
        <MilestoneCard
          loadingDelete={isPendingDelete}
          hideActions={(!!editing && index !== editing) || !editMode}
          onDelete={() =>
            milestone?.id && deleteMilestone(milestone?.id)
          }
          onCancel={() => handleCancel(index)}
          onSave={handleSave(index)}
          loadingSave={isPendingUpdateBid || isPendingCreateBid}
          key={index}
          view={index !== editing || !editMode}
          tourMilestoneFieldsTargetId={
            index === 0 ? "tour-create-bid-milestone-fields" : undefined
          }
          tourPaymentTargetId={
            index === 0 ? "tour-create-bid-milestone-payment" : undefined
          }
          {...milestone}
          onEdit={handleToggle(index)}
          currency={project?.currency || null}
        />
      ))}

      {editMode && !editing && (
        <button
          className="text-left w-fit flex text-sm text-primary  [&>svg]:size-5 gap-2"
          onClick={handleAdd}
        >
          <Plus />
          Add another milestone
        </button>
      )}

      <div id="tour-create-bid-delivery-milestone" className="card p-8">
        <div className="text-gray-400">
          <h3 className="mb-2 font-semibold  text-subtitle-1">
            Delivery Milestone
          </h3>
          <h3 className="mb-2 font-semibold">
            {project?.deliveryAddress?.state},{" "}
            {project?.deliveryAddress?.country}
          </h3>
          <p className="text-sm mb-4">
            The Client&apos;s full address will be shown once the project is Active
          </p>

          <VariableDeliverySelect
            selectedDeliveryType={selectedDeliveryMethodType}
            onChangeDeliveryType={setSelectedDeliveryMethodType}
          />
        </div>
        <DeliveryMethodPicker
          disabled={!!editing || !editMode}
          value={deliveryMethod || ""}
          onValueChange={(value: UmojaLinnDeliveryMethod) =>
            setDeliveryMethod(value)
          }
        />
        <MileStoneCardFooter
          view={!!editing || !editMode}
          currency={project?.currency || null}
          label="Milestone Payment"
          price={deliveryMilestonePrice}
          onPriceChange={setDeliveryMilestonePrice}
        />
      </div>

      <div className="font-semibold">
        <div className="bg-slate-200/30 text-sm p-4 flex flex-col gap-4">
          <p className="flex justify-between ">
            <span className="text-foreground-body">Total Price</span>
            <span>
              {getCurrencySymbol(project?.currency)}
              {formatCurrencyValue(totalPrice)}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground-body">Commission</span>
            <span>
              -{getCurrencySymbol(project?.currency)}
              {formatCurrencyValue(totalPrice * SERVICE_FEE_PERCENTAGE / 100)}
            </span>
          </p>
        </div>
        <p className="flex justify-between p-4 py-2 bg-gray-200">
          {" "}
          <span className="text-foreground-body">You receive</span>
          <span>
            {getCurrencySymbol(project?.currency)}
            {formatCurrencyValue(totalPrice * (1 - SERVICE_FEE_PERCENTAGE / 100))}
          </span>
        </p>
      </div>
      <p className="text-subtitle-2 font-semibold text-right">
        <span className="text-foreground-body">Total Price</span>
        {"  "}
        <span>
          {getCurrencySymbol(project?.currency)}
          {formatCurrencyValue(totalPrice)}
        </span>
      </p>
      {bid?.additionalNotesToClient && (
        <Alert
          type="error"
          title="Your rationale"
          message={bid.additionalNotesToClient}
        />
      )}
      <Separator className="bg-gray-200 h-px" orientation="horizontal" />
      {editMode && addNote && (
        <div className="card p-8">
          <TextAreaField
            label="Additional note to client"
            placeholder="Enter a description..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex gap-1 items-center">
          <Switch
            id="add-note-switch"
            checked={addNote}
            disabled={!editMode || isUpdatingBid || isSubmittingBid}
            onCheckedChange={() => setAddNote((prev) => !prev)}
          />{" "}
          <Label htmlFor="add-note-switch">Add note</Label>
        </div>
        {editMode && (
          <div className="flex gap-4">
            {bid?.status === "DRAFT" && (
              <Button
                variant="outline"
                disabled={isUpdatingBid || isSubmittingBid}
                onClick={() => handleUpdate("UPDATE")}
              >
                Save & Exit
              </Button>
            )}
            <Button
              id="tour-create-bid-submit"
              variant="default"
              loading={isUpdatingBid || isSubmittingBid}
              onClick={() => handleUpdate("LIVE")}
            >
              Submit
            </Button>
          </div>
        )}
        <TotalPriceError
          pendingConfirm={false}
          // pendingConfirm={isUpdatingBid || isSubmittingBid}
          negotiable={!!bid?.project?.negotiable}
          open={showExcessDialog}
          onOpenChange={setShowExcessDialog}
          excess={excess}
          currency={bid?.project?.currency}
          onConfirm={() => {
            handleUpdateAction(mode);
            setShowExcessDialog(false);

          }}
        />
        <StripeStatusModal
          currency={project?.currency || "USD"}
          open={showStripeModal}
          onOpenChange={setShowStripeModal}
          onProceed={handleFinalSubmit}
          {...paymentStatus}
        />
      </div>
    </div>
  );
};

export default BidPage;

