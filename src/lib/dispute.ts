import { EMileStoneStatus } from "@/types/enum";
import {
  IUmojaLinnDispute,
  TCreateBuyerDisputePayload,
  TCreateDesignerDisputePayload,
  TDisputeStatus,
  TRespondToDisputePayload,
} from "@/types/dispute";
import { UmojaLinnMilestone } from "@/types/project";

const toFileArray = (files?: FileList | File[]) => {
  if (!files) return [];
  if (files instanceof FileList) return Array.from(files);
  return files;
};

export const appendDisputeAttachmentFiles = (
  formData: FormData,
  files?: FileList | File[],
) => {
  toFileArray(files).forEach((file) => {
    formData.append("attachments", file);
  });
};

export const buildCreateDisputeFormData = (
  payload: TCreateBuyerDisputePayload | TCreateDesignerDisputePayload,
): FormData => {
  const formData = new FormData();

  formData.append("type", payload.type);
  formData.append("milestoneIds", JSON.stringify(payload.milestoneIds));
  formData.append("reasonCategory", payload.reasonCategory);
  formData.append("reasonDetail", payload.reasonDetail);

  if (payload.requestedRefundAmount) {
    formData.append(
      "requestedRefundAmount",
      String(payload.requestedRefundAmount),
    );
  }

  appendDisputeAttachmentFiles(formData, payload.attachmentFiles);

  return formData;
};

export const buildRespondToDisputeFormData = (
  payload: TRespondToDisputePayload,
): FormData => {
  const formData = new FormData();

  formData.append("message", payload.message);
  formData.append("preferredResolution", payload.preferredResolution);

  if (
    payload.preferredResolution === "PARTIAL_REFUND" &&
    payload.preferredRefundAmount != null
  ) {
    formData.append(
      "preferredRefundAmount",
      String(payload.preferredRefundAmount),
    );
  }

  appendDisputeAttachmentFiles(formData, payload.attachmentFiles);

  payload.attachmentUrls?.forEach((url) => {
    formData.append("attachments", url);
  });

  return formData;
};

const ACTIVE_DISPUTE_STATUSES = new Set<TDisputeStatus>([
  "OPEN",
  "IN_REVIEW",
  "AWAITING_PSP_CONFIRMATION",
]);

const DISPUTEABLE_MILESTONE_STATUSES = new Set<UmojaLinnMilestone["status"]>([
  EMileStoneStatus.PENDING,
  EMileStoneStatus.ACTIVE,
  EMileStoneStatus.IN_REVIEW,
  // EMileStoneStatus.APPROVED,
  EMileStoneStatus.REJECTED,
]);

const FUNDED_TRANSACTION_STATUSES = new Set<
  UmojaLinnMilestone["transactionStatus"]
>(["FUNDED", "PAID", "PROCESSING"]);

export const isActiveDisputeStatus = (status: TDisputeStatus) =>
  ACTIVE_DISPUTE_STATUSES.has(status);

export const getActiveDisputedMilestoneIds = (
  disputes: IUmojaLinnDispute[],
) => {
  const milestoneIds = new Set<string>();

  disputes.forEach((dispute) => {
    if (!isActiveDisputeStatus(dispute.status)) return;

    dispute.disputeMilestones?.forEach((disputeMilestone) => {
      milestoneIds.add(disputeMilestone.milestoneId);
    });

    if (dispute.milestoneId) {
      milestoneIds.add(dispute.milestoneId);
    }
  });

  return milestoneIds;
};

export const isMilestoneDisputed = (
  milestone: UmojaLinnMilestone,
  disputedMilestoneIds: Set<string>,
) => {
  return (
    milestone.status === EMileStoneStatus.DISPUTED ||
    disputedMilestoneIds.has(milestone.id)
  );
};

export const getSelectedMilestonesRefundAmount = (
  milestones: Array<{ id: string; amount?: number | null }>,
  selectedMilestoneIds: string[],
) =>
  milestones
    .filter((milestone) => selectedMilestoneIds.includes(milestone.id))
    .reduce((total, milestone) => total + (Number(milestone.amount) || 0), 0);

export const isMilestoneEligibleForDispute = (
  milestone: UmojaLinnMilestone,
  disputedMilestoneIds: Set<string>,
) => {
  if (
    isMilestoneDisputed(milestone, disputedMilestoneIds) ||
    milestone.status === EMileStoneStatus.REFUNDED ||
    milestone.status === EMileStoneStatus.IN_ACTIVE
  ) {
    return false;
  }

  if (!DISPUTEABLE_MILESTONE_STATUSES.has(milestone.status)) {
    return false;
  }

  if (!FUNDED_TRANSACTION_STATUSES.has(milestone.transactionStatus)) {
    return false;
  }

  return true;
};
