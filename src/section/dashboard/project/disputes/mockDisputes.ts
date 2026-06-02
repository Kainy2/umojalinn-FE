import { IProjectDispute } from "./@types";

export const MOCK_PROJECT_DISPUTES: IProjectDispute[] = [
  {
    id: "dispute-1",
    type: "BUYER_ISSUE",
    status: "IN_REVIEW",
    createdAt: "2026-04-01T10:00:00.000Z",
    reason: "OTHER",
    reasonLabel: "Poor Communication",
    description:
      "I didn't hear from the designer for over a week despite multiple messages. The timeline was agreed but there has been no update on progress.",
    attachments: [
      { id: "a1" },
      { id: "a2" },
      { id: "a3" },
      { id: "a4" },
    ],
    relatedMilestones: [
      {
        milestoneId: "m1",
        label: "2nd Milestone: Milestone Name",
        amount: 28000,
        tag: "DISPUTED",
      },
      {
        milestoneId: "m2",
        label: "3rd Milestone: Milestone Name",
        amount: 28000,
        tag: "DISPUTED",
      },
    ],
    requiresResponse: true,
    responseDeadline: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
    ).toISOString(),
    fullRefundAmount: 1000,
  },
  {
    id: "dispute-2",
    type: "DESIGNER_CANCELLATION",
    status: "RESOLVED",
    createdAt: "2026-04-01T10:00:00.000Z",
    reason: "DELAY_TIMELINE_ISSUES",
    description:
      "I didn't hear from the designer for over a week despite multiple messages. The timeline was agreed but there has been no update on progress.",
    attachments: [
      { id: "b1" },
      { id: "b2" },
      { id: "b3" },
      { id: "b4" },
    ],
    relatedMilestones: [
      {
        milestoneId: "m1",
        label: "2nd Milestone: Milestone Name",
        amount: 250000,
        tag: "REFUNDED",
      },
      {
        milestoneId: "m2",
        label: "3rd Milestone: Milestone Name",
        amount: 250000,
        tag: "REFUNDED",
      },
    ],
    activities: [
      {
        id: "act-1",
        type: "DISPUTE_RAISED",
        date: "2026-04-01T10:00:00.000Z",
        title: "Dispute raised",
      },
      {
        id: "act-2",
        type: "BUYER_RESPONSE",
        date: "2026-04-05T10:00:00.000Z",
        title: "Buyer response",
        expandable: true,
        body: "I have provided additional context and evidence regarding the delay. I expect a partial refund for the affected milestones.",
      },
      {
        id: "act-3",
        type: "OUTCOME",
        date: "2026-04-06T10:00:00.000Z",
        title: "Outcome: Refund Issued",
        expandable: true,
        outcomeDetails: {
          refundedAmount: 250000,
          reason:
            "Refund issued due to confirmed timeline delays and lack of communication from the designer.",
          paymentNote:
            "Funds will be returned to the buyer's original payment method within 5–7 business days.",
        },
      },
    ],
    summaryDocUrl: undefined,
  },
  {
    id: "dispute-3",
    type: "DESIGNER_REFUND",
    status: "RESOLVED",
    createdAt: "2026-04-21T10:00:00.000Z",
    reason: "DELAY_TIMELINE_ISSUES",
    description:
      "Refund request processed after mutual agreement on milestone cancellation.",
    relatedMilestones: [
      {
        milestoneId: "m3",
        label: "1st Milestone: Milestone Name",
        amount: 15000,
        tag: "REFUNDED",
      },
    ],
    activities: [
      {
        id: "act-4",
        type: "DISPUTE_RAISED",
        date: "2026-04-21T10:00:00.000Z",
        title: "Dispute raised",
      },
      {
        id: "act-5",
        type: "OUTCOME",
        date: "2026-04-22T10:00:00.000Z",
        title: "Outcome: Refund Issued",
        expandable: true,
        outcomeDetails: {
          refundedAmount: 15000,
          reason: "Refund approved per designer refund request.",
          paymentNote:
            "Funds will be returned to the buyer's original payment method within 5–7 business days.",
        },
      },
    ],
  },
];

export const DISPUTE_TYPE_TITLES: Record<
  IProjectDispute["type"],
  string
> = {
  BUYER_ISSUE: "Buyer Issue",
  DESIGNER_CANCELLATION: "Designer Cancellation Request",
  DESIGNER_REFUND: "Designer Refund Request",
};
