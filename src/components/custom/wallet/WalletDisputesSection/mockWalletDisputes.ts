import { IUmojaLinnDispute } from "@/types/dispute";

export const MOCK_WALLET_DISPUTE_LOCKED_AMOUNT = 25000;

export const MOCK_WALLET_DISPUTES: IUmojaLinnDispute[] = [
  {
    id: "wallet-dispute-1",
    disputeId: "wallet-dispute-1",
    type: "DESIGNER_REFUND",
    status: "IN_REVIEW",
    currency: "NAIRA",
    projectId: "project-1",
    milestoneId: "milestone-1",
    initiatorUserId: "user-1",
    respondentUserId: "user-2",
    requestedRefundAmount: 15000,
    createdAt: "2026-04-21T10:00:00.000Z",
    updatedAt: "2026-04-21T10:00:00.000Z",
    project: { title: "Yellow Sundress for wedding" },
  },
  {
    id: "wallet-dispute-2",
    disputeId: "wallet-dispute-2",
    type: "DESIGNER_REFUND",
    status: "IN_REVIEW",
    currency: "NAIRA",
    projectId: "project-2",
    milestoneId: "milestone-2",
    initiatorUserId: "user-1",
    respondentUserId: "user-2",
    requestedRefundAmount: 10000,
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    project: { title: "Agbada for my husband" },
  },
];
