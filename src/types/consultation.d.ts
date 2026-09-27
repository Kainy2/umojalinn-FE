import { UmojaLinnCurrency } from "./project";
import { UmojaLinnTimestamp } from "./util";

// ─── Status Types ────────────────────────────────────────────────────────────

export type BuyerConsultationStatus =
  | "MATCHING"
  | "MATCHED"
  | "REQUESTED"
  | "BOOKED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type DesignerConsultationStatus =
  | "ASSIGNED"
  | "REQUESTED"
  | "BOOKED"
  | "LIVE"
  | "AWAITING_SUMMARY"
  | "COMPLETED"
  | "CANCELLED";

export type ConsultationBookedSubStatus =
  | "BOOKED"
  | "RESCHEDULE_REQUESTED"
  | "NO_SHOW";

export type ConsultationCompletedSubStatus =
  | "AWAITING_SUMMARY"
  | "SUMMARY_SUBMITTED"
  | "SUMMARY_ACCEPTED"
  | "SUMMARY_REJECTED"
  | "DISPUTE";

export type ConsultationSummaryStatus =
  | "AWAITING"
  | "SUBMITTED"
  | "ACCEPTED"
  | "REJECTED";

export type ConsultationEscrowStatus =
  | "PENDING"
  | "FUNDED"
  | "HELD"
  | "RELEASED"
  | "REFUNDED";

export type ConsultationJourney =
  | "BUYER_GENERAL_REQUEST"
  | "DESIGNER_REQUEST"
  | "BUYER_INSTANT_BOOK";

// ─── Sub-types ───────────────────────────────────────────────────────────────

export type UmojaLinnConsultationSlot = {
  date: string; // ISO date string e.g. "2025-01-25"
  startTime: string; // "10:30"
  endTime: string; // "11:00"
  durationMins: 30 | 45 | 60;
  timezone: string; // "UTC", "Africa/Lagos", etc.
};

export type UmojaLinnConsultationSummary = {
  id: string;
  docUrl: string | null;
  docName: string | null;
  docSizeKb: number | null;
  status: ConsultationSummaryStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
} & UmojaLinnTimestamp;

export type UmojaLinnConsultationEscrow = {
  status: ConsultationEscrowStatus;
  amount: number;
  currency: UmojaLinnCurrency;
  heldAmount: number;
  releasedAmount: number;
};

export type UmojaLinnConsultationProject = {
  id: string | null;
  title: string;
  description: string;
  budget: { min: number; max: number } | null;
  currency: UmojaLinnCurrency;
  timeline: { startDate: string; endDate: string } | null;
  deliveryCountry: string | null;
  gender: "MALE" | "FEMALE" | null;
  inspirationImages: string[];
  clothingType: string | null;
  additionalNotes: string | null;
};

export type UmojaLinnConsultationParticipant = {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoUri: string | null;
  tag: string;
  about: string | null;
  location: string | null;
  totalEarnings: number | null;
  totalJobs: number | null;
  successRate: number | null;
  averageRating: number | null;
  specialistType: string | null;
  brandName: string | null;
  summaryAcceptanceRate: number | null;
};

export type UmojaLinnConsultationRescheduleRequest = {
  id: string;
  proposedSlot: UmojaLinnConsultationSlot;
  message: string | null;
  proposedBy: "DESIGNER" | "BUYER";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  proposedAt: string;
};

// ─── Main Consultation Type ───────────────────────────────────────────────────

export type UmojaLinnConsultation = {
  id: string;
  journey: ConsultationJourney;

  // Status — use buyerStatus or designerStatus depending on viewer role
  buyerStatus: BuyerConsultationStatus;
  designerStatus: DesignerConsultationStatus;
  bookedSubStatus: ConsultationBookedSubStatus | null;
  completedSubStatus: ConsultationCompletedSubStatus | null;
  isCancelled: boolean;

  // Participants
  buyer: UmojaLinnConsultationParticipant;
  designer: UmojaLinnConsultationParticipant | null; // null when still MATCHING

  // Fee
  consultationFee: number | null;
  currency: UmojaLinnCurrency;
  paymentProcessingFee: number | null;
  totalFee: number | null;

  // Project details
  project: UmojaLinnConsultationProject;

  // Booked slot
  slot: UmojaLinnConsultationSlot | null;

  // Escrow
  escrow: UmojaLinnConsultationEscrow | null;

  // Summary
  summary: UmojaLinnConsultationSummary | null;

  // Chat
  chatChannelId: string | null;

  // Reschedule
  rescheduleRequest: UmojaLinnConsultationRescheduleRequest | null;

  // Invoice
  invoiceUrl: string | null;

  // Cancellation
  cancellationReason: string | null;
  cancelledBy: "BUYER" | "DESIGNER" | "ADMIN" | null;
  refundedAmount: number | null;

  // Dispute
  hasOpenDispute: boolean;
  disputeRaisedBy: "BUYER" | "DESIGNER" | "SYSTEM" | null;
} & UmojaLinnTimestamp;

// ─── Designer Availability ────────────────────────────────────────────────────

export type ConsultationDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type UmojaLinnConsultationAvailabilitySlot = {
  day: ConsultationDay;
  from: string; // "09:00"
  to: string; // "17:00"
  isAvailable: boolean;
};

export type UmojaLinnConsultationDuration = {
  durationMins: 30 | 45 | 60;
  price: number;
  currency: UmojaLinnCurrency;
  isEnabled: boolean;
};

export type UmojaLinnConsultationAvailability = {
  id: string;
  designerId: string;
  isAvailableForConsultation: boolean;
  timezone: string;
  slots: UmojaLinnConsultationAvailabilitySlot[];
  durations: UmojaLinnConsultationDuration[];
  bufferMinsBetweenSessions: number;
  advanceBookingDays: number; // how many days ahead buyer can book
} & UmojaLinnTimestamp;

// ─── Available Timeslot (for booking calendar) ────────────────────────────────

export type UmojaLinnAvailableTimeslot = {
  date: string; // "2025-01-25"
  slots: {
    startTime: string; // "10:00"
    endTime: string; // "10:30"
    durationMins: 30 | 45 | 60;
  }[];
};

// ─── Request / Form Payloads ──────────────────────────────────────────────────

export type TCreateConsultationRequestPayload = {
  projectTitle: string;
  projectDescription: string;
  budget: { min: number; max: number };
  currency: UmojaLinnCurrency;
  timeline: { startDate: string; endDate: string };
  deliveryCountry: string;
  gender: "MALE" | "FEMALE";
  inspirationImages: string[];
  clothingType: string;
  additionalNotes: string;
};

export type TBookConsultationPayload = {
  consultationId: string;
  slot: UmojaLinnConsultationSlot;
  durationMins: 30 | 45 | 60;
};

export type TSuggestConsultationPayload = {
  buyerProjectId: string;
  slot: UmojaLinnConsultationSlot;
  fee: number;
  currency: UmojaLinnCurrency;
  message: string;
};

export type TSubmitSummaryPayload = {
  consultationId: string;
  docUrl: string;
  docName: string;
  docSizeKb: number;
};

export type TReschedulePayload = {
  consultationId: string;
  proposedSlot: UmojaLinnConsultationSlot;
  message: string;
};

export type TSaveAvailabilityPayload = Omit<
  UmojaLinnConsultationAvailability,
  "id" | "designerId" | "createdAt" | "updatedAt"
>;

// ─── Filters ─────────────────────────────────────────────────────────────────

export type ConsultationBuyerFilter =
  | "ALL"
  | "MATCHING"
  | "MATCHED"
  | "REQUESTED"
  | "BOOKED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type ConsultationDesignerFilter =
  | "ALL"
  | "ASSIGNED"
  | "REQUESTED"
  | "BOOKED"
  | "LIVE"
  | "ADD_SUMMARY"
  | "COMPLETED"
  | "CANCELLED";
