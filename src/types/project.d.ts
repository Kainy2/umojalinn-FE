import { UmojaLinnUser, UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnCurrency = "EURO" | "NAIRA";

export type UmojaLinnProject = {
  id: string;
  title: null | string;
  about: null | string;
  gender: null | "MALE" | "FEMALE";
  additionalNotes: null | string;
  dueDate: null | string;
  bidAcceptedDate: null | string;
  projectType: "PRIVATE" | "PUBLIC";
  status: "DRAFT" | "ADS" | "LIVE" | "COMPLETED";
  fundStatus: "AWAITING_FUND" | "PROCESSING" | "FUNDED";
  buyerId: string;
  designerId: string;
  budget: number | null;
  escrowBalance: number | null;
  amountFunded: number | null;
  approvedBudget: number | null;
  currency: null | UmojaLinnCurrency;
  sizingTemplateId: string | null;
  percentageCompleted: number;
  reviews: Array<UmojaLinnProjectReview> | null;
  deliveryAddress: {
    id: string;
    country: null | string;
    city: null | string;
    address: null | string;
    state: null | string;
    zipCode: null | string;
    projectId: string;
    userId: string | null;
  } & UmojaLinnTimestamp;
  negotiable: null | boolean;
  specialistTypeId: null | string;
  Gallery: Array<
    {
      id: string;
      projectId: string;
      imageUrl: string;
      title: string;
      isCoverImage: boolean;
    } & UmojaLinnTimestamp
  > | null;
  buyer: Pick<
    UmojaLinnUserRoleProfile,
    "id" | "userId" | "profileStrength" | "createdAt" | "updatedAt" | "user"
  >;
  designer: Pick<
    UmojaLinnUserRoleProfile,
    | "id"
    | "userId"
    | "profileStrength"
    | "createdAt"
    | "updatedAt"
    | "isAvailable"
    | "user"
  >;
  clothingTypes: Array<
    {
      id: string;
      name: string;
    } & UmojaLinnTimestamp
  > | null;
  bids: UmojaLinnBid[] | null;
  specialistType: UmojaLinnSpecialistType | null;
} & UmojaLinnTimestamp;

export type UmojaLinnDeliveryMethod =
  | "TRACKED"
  | "NON_TRACKED"
  | "IN_PERSON_PICKUP";

export type UmojaLinnDeliveryMilestoneReviewProps = {
  description: string;
  media?: string[] | File[] | FileList | null;
  city?: string; // only required for IN_PERSON_PICKUP
  country?: string; // only required for IN_PERSON_PICKUP
  state?: string; // only required for IN_PERSON_PICKUP
  street?: string; // only required for IN_PERSON_PICKUP
  zipCode?: string; // only required for IN_PERSON_PICKUP
  courierService?: string; // only required for TRACKED and NON_TRACKED
  courierServiceLink?: string; // only required for TRACKED
  trackingId?: string; // only required for TRACKED
};

export type UmojaLinnMilestone = {
  id: string;
  title?: string;
  description?: string;
  amount: null | number;
  bidId: string;
  state?: string;
  city?: string;
  country?: string;
  deliveryMethod?: UmojaLinnDeliveryMethod;
  status:
    | "IN_ACTIVE"
    | "PENDING"
    | "ACTIVE"
    | "IN_REVIEW"
    | "REJECTED"
    | "APPROVED";
  transactionStatus: "AWAITING_FUND" | "PROCESSING" | "FUNDED" | "PAID";
  projectId: string | null;
} & UmojaLinnTimestamp;

export type UmojaLinnBid = {
  id: string;
  projectId: string;
  designerId: string;
  amount: number;
  additionalNotesToClient: null | string;
  rejectionReason: null | string;
  status: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: "2025-01-03T11:41:49.572Z";
  updatedAt: "2025-01-03T11:41:49.572Z";
  project: UmojaLinnProject;
  designer: UmojaLinnUserRoleProfile;
  milestones: UmojaLinnMilestone[];
  sizingTemplateRequested: boolean;
  history: Array<
    {
      id: string;
      bidId: string;
      amount: number;
      numberOfMileStones: number;
    } & UmojaLinnTimestamp
  >;
  deliveryMilestone: {
    id: string;
    bidId: string;
    state: string;
    city: string;
    country: string;
    amount: null | number;
    deliveryMethod: null | UmojaLinnDeliveryMethod;
  } & UmojaLinnTimestamp;
};

export type UmojaLinnMaleSizingTemplateProps = {
  neck: number | null;
  chest: number | null;
  waist: number | null;
  shoulderWidth: number | null;
  backLength: number | null;
  bodyRise: number | null;
  hips: number | null;
  armHoleCircumference: number | null;
  bicep: number | null;
  wrist: number | null;
  desiredSleeveLength: number | null;
  desiredShirtLength: number | null;
  desiredAgbadaLength: number | null;
  thigh: number | null;
  knee: number | null;
  calf: number | null;
  ankle: number | null;
  inseam: number | null;
  waistToKneePoint: number | null;
  desiredTrouserOrSkirtLength: number | null;
  shoulderToFloor: number | null;
  height: number | null;
  headCircumference: number | null;
};

export type UmojaLinnFemaleSizingTemplateProps = {
  neck: number | null;
  bust: number | null;
  underBust: number | null;
  waist: number | null;
  shoulderWidth: number | null;
  shoulderToNipple: number | null;
  shoulderToUnderBust: number | null;
  shoulderToWaist: number | null;
  nippleToNipple: number | null;
  backLength: number | null;
  bodyRise: number | null;
  hips: number | null;
  armHoleCircumference: number | null;
  bicep: number | null;
  wrist: number | null;
  desiredSleeveLength: number | null;
  desiredBlouseOrTopLength: number | null;
  desiredDressLength: number | null;
  thigh: number | null;
  knee: number | null;
  calf: number | null;
  ankle: number | null;
  inseam: number | null;
  waistToKneePoint: number | null;
  desiredTrouserOrSkirtLength: number | null;
  shoulderToFloor: number | null;
  height: number | null;
  headCircumference: number | null;
};

export type UmojaLinnSizingTemplate = {
  id: string;
  buyerId: string;
  name: string;
  unit: "CM" | "INCH";
  gender: "MALE" | "FEMALE";
  status: "DRAFT" | "LIVE" | "IN_USE";
  buyer?: UmojaLinnUserRoleProfile;
  projects: UmojaLinnProject[];
  metadata?: {
    reviews?: Record<
      keyof (UmojaLinnMaleSizingTemplateProps &
        UmojaLinnFemaleSizingTemplateProps),
      string
    > | null;
  };
} & Partial<
  UmojaLinnMaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
> &
  UmojaLinnTimestamp;

export type UmojaLinnMilestoneSubmission = {
  id: string;
  milestoneId: string;
  description: string;
  images: Array<string>;
  links: Array<string>;
  deliveryMilestoneId: null | string;
  state: null | string;
  city: null | string;
  country: null | string;
  street: null | string;
  zipCode: null | string;
  courierService: strinng | null;
  courierServiceLink: string | null;
  trackingId: string | null;
  status: "APPROVED" | "REJECTED" | "PENDING";
  rejectionReason?: null | string;
  milestone: {
    project: {
      buyer: {
        user: UmojaLinnUser;
      };
      designer: {
        user: UmojaLinnUser;
      };
    };
  } | null;
} & UmojaLinnTimestamp &
  UmojaLinnDeliveryMilestoneReviewProps;

export type UmojaLinnMediaLink = {
  type: "link" | "media";
  url: string;
  createdAt: string;
};

export type UmojalinnPaymentChannels = "PAYPAL" | "DIRECT_TRANSFER"; //  | "STRIPE"

export type UmojaLinnWithdrawalMethod = {
  id: string;
  userId: string;
  channel: UmojalinnPaymentChannels;
  currency: UmojaLinnCurrency;
  paypalEmail: string;
  accountName: null | string;
  bankName: null | string;
  routingNumber: null;
  accountNumber: null;
  bankAddress: null;
  iban: null | string;
  swiftCode: null | string;
} & UmojaLinnTimestamp;

export type UmojalinnWalletTransaction = {
  id: string;
  paymentChannel: UmojalinnPaymentChannels;
  currency: UmojaLinnCurrency;
  amount: number;
  transactionId: string;
  status: "PENDING" | "FAILED" | "SUCCESS";
  transactionType:
    | "FUND_ESCROW"
    | "WITHDRAWAL_REQUEST"
    | "WALLET_TO_UP"
    | "MILESTONE_COMPLETED";
  receiptUrl: string;
  projectId: string;
  walletId: null | string;
  project?: UmojaLinnProject;
} & UmojaLinnTimestamp;

export type UmojalinnWallet = {
  id: string;
  userId: string;
  ngnBalance: number;
  ngnEscrowBalance: number;
  eurBalance: number;
  eurEscrowBalance: number;
  transactions: UmojalinnWalletTransaction[];
} & UmojaLinnTimestamp;

export type UmojaLinnChat = {
  message?: string;
  imageUrl?: string;
  imageMeta?: {
    fileName: string;
    fileSize: string;
  };
  user?: Pick<
    UmojaLinnUser,
    "firstName" | "lastName" | "profilePhotoUri" | "id"
  >;
  type: "MESSAGE" | "NOTIFICATION";
  severity?: "ERROR" | "SUCCESS";
  createdAt: string | Date;
};

export type UmojaLinnProjectReview = {
  id: string;
  designerId: null | string;
  buyerId: null | string;
  projectId: string;
  rating: number;
  message: string;
  images: string[];
  reviewType: "EXPERIENCE" | "CLOTHING_QUALITY";
  buyer?: Pick<UmojaLinnUserRoleProfile, "user"> | null;
  designer?: Pick<UmojaLinnUserRoleProfile, "user"> | null;
  project?: UmojaLinnProject;
} & UmojaLinnTimestamp;

export type UmojaLinnSpecialistType = {
  id: string;
  name: string;
} & UmojaLinnTimestamp;
