import { EMileStoneStatus } from "@/types/enum";
import {
  IUmojaLinnDispute,
  TCreateBuyerDisputePayload,
  TCreateDesignerDisputePayload,
  TDisputeFundLocation,
  TDisputeStatus,
  TRespondToDisputePayload,
} from "@/types/dispute";
import { UmojaLinnMilestone } from "@/types/project";

const WALLET_IMPACT_FUND_LOCATIONS = new Set<TDisputeFundLocation>([
  "WALLET",
  "WITHDRAWN",
]);

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
) => !isMilestoneDisputed(milestone, disputedMilestoneIds);

/** true = wallet impact, false = escrow-only, null = unknown */
export const doesDisputeImpactDesignerWallet = (
  dispute?: IUmojaLinnDispute | null,
): boolean | null => {
  if (!dispute) return null;

  const locations: TDisputeFundLocation[] = [];

  if (dispute.fundLocation) {
    locations.push(dispute.fundLocation);
  }

  dispute.disputeMilestones?.forEach((disputeMilestone) => {
    if (disputeMilestone.fundLocation) {
      locations.push(disputeMilestone.fundLocation);
    }
  });

  if (!locations.length) return null;

  if (locations.some((location) => WALLET_IMPACT_FUND_LOCATIONS.has(location))) {
    return true;
  }

  return locations.every((location) => location === "ESCROW") ? false : null;
};

export const doesSelectionImpactDesignerWallet = (
  milestones: Array<{
    id: string;
    transactionStatus?: UmojaLinnMilestone["transactionStatus"];
  }>,
  selectedMilestoneIds: string[],
) =>
  milestones.some(
    (milestone) =>
      selectedMilestoneIds.includes(milestone.id) &&
      milestone.transactionStatus === "PAID",
  );

export const shouldRedirectToInsufficientBalance = ({
  dispute,
  selectedMilestones,
  selectedIds,
  amount,
  availableBalance,
  walletSummaryInsufficient,
}: {
  dispute?: IUmojaLinnDispute | null;
  selectedMilestones: Array<{
    id: string;
    transactionStatus?: UmojaLinnMilestone["transactionStatus"];
  }>;
  selectedIds: string[];
  amount: number;
  availableBalance: number;
  walletSummaryInsufficient: number;
}) => {
  const impactsWallet =
    doesDisputeImpactDesignerWallet(dispute) ??
    doesSelectionImpactDesignerWallet(selectedMilestones, selectedIds);

  if (!impactsWallet) return false;

  return amount > availableBalance || walletSummaryInsufficient > 0;
};
