import { EDeliveryMileStoneType } from "./enum";
import { UmojaLinnUser, UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnCurrency = "EURO" | "NAIRA" | "USD" | "GBP" | "CAD";

// Male standard sizes (letter-based)
export type UmojalinnMaleStandardSize =
  | "XXS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "3XL"
  | "4XL"
  | "5XL"
  | "6XL";

// Female standard sizes (UK number-based)
export type UmojalinnFemaleStandardSize =
  | "4"
  | "6"
  | "8"
  | "10"
  | "12"
  | "14"
  | "16"
  | "18"
  | "20"
  | "22"
  | "24"
  | "26"
  | "28"
  | "30"
  | "32";

// Combined type for backward compatibility
export type UmojalinnStandardSize =
  | UmojalinnMaleStandardSize
  | UmojalinnFemaleStandardSize;

export type UmojaLinnSizingTemplateUnit = "CM" | "INCH";

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
  sizingTemplate: UmojaLinnSizingTemplate | null;
  percentageCompleted: number;
  draftPercentageCompleted: number;
  allReviewsSubmitted: boolean;
  willProvideMaterials: boolean;
  showDesignerReviews: boolean;
  showBuyerReviews: boolean;
  reviews: Array<UmojaLinnProjectReview> | null;
  chatLinks: Array<string> | null;
  chatMedia: Array<string> | null;
  requestedMeasurementPoints: string[];
  sizingTemplatePdfUrl: string | null;
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

export type VariableDeliveryMileStoneSubmissions = {
  id: string;
  deliveryMileStoneId: string;
  amount: number;
  status: UmojaLinnMilestoneSubmissionStatus;
  deliveryMethod: UmojaLinnDeliveryMethod; // optional relation
} & UmojaLinnTimestamp;

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
  variableSubmissions?: VariableDeliveryMileStoneSubmissions[];
  deliveryMileStoneType: EDeliveryMileStoneType;
  lastMilestoneApprovedAt: string | null;
  currency: UmojaLinnCurrency;
  status:
    | "IN_ACTIVE"
    | "PENDING"
    | "ACTIVE"
    | "IN_REVIEW"
    | "REJECTED"
    | "APPROVED";
  transactionStatus: "AWAITING_FUND" | "PROCESSING" | "FUNDED" | "PAID";
  project: {
    fundStatus: "AWAITING_FUND" | "PROCESSING" | "FUNDED";
    buyer: {
      user: Pick<
        UmojaLinnUser,
        "firstName" | "lastName" | "profilePhotoUri" | "address"
      >;
    };
    designer: {
      user: Pick<
        UmojaLinnUser,
        "firstName" | "lastName" | "profilePhotoUri" | "address"
      >;
    };
  };
  projectId: string | null;
  paidOutDate: string | null;
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
  requestedMeasurementPoints: string[];
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
    deliveryMileStoneType: EDeliveryMileStoneType;
  } & UmojaLinnTimestamp;
};
export type UmojaLinnSubmitBidResponse = {
  paymentAccountConnected: boolean;
  paymentAccountOnboarded: boolean;
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
  ukStandardSize: UmojalinnStandardSize | null;
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
  ukStandardSize: UmojalinnStandardSize | null;
};

export type UmojaLinnSizingTemplate = {
  id: string;
  buyerId: string;
  name: string;
  unit: UmojaLinnSizingTemplateUnit;
  gender: "MALE" | "FEMALE";
  status: "DRAFT" | "LIVE" | "IN_USE";
  buyer?: UmojaLinnUserRoleProfile;
  projects: UmojaLinnProject[];
  defaultFieldsLocked?: boolean;
  requestedMeasurementPoints?: string[];
  submittedMeasurementPoints?: string[];
  lastReminderSentAt?: string;
  lastReminderSentBy?: string;
  isChangesUpdated?: boolean;
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

export type UmojaLinnMilestoneSubmissionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type UmojaLinnMilestoneSubmission = {
  id: string;
  milestoneId: string;
  description: string;
  images: Array<{
    url: string;
    meta: {
      fileName: string; // eg. "invite.png",
      fileSize: string; // eg. "46.31 KB"
    };
  }>;
  links: Array<string>;
  deliveryMilestoneId: null | string;
  state: null | string;
  city: null | string;
  country: null | string;
  street: null | string;
  zipCode: null | string;
  courierService: string | null;
  courierServiceLink: string | null;
  trackingId: string | null;
  status: UmojaLinnMilestoneSubmissionStatus;
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
  meta: {
    fileName: string; // eg. "invite.png",
    fileSize: string; // eg. "46.31 KB"
  };
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
  isDefault: boolean;
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
  usdBalance: number;
  usdEscrowBalance: number;
  gbpBalance: number;
  gbpEscrowBalance: number;
  cadBalance: number;
  cadEscrowBalance: number;
  transactions: UmojalinnWalletTransaction[];
} & UmojaLinnTimestamp;

export type UmojaLinnChat = {
  message?: string;
  sessionId?: string;
  endedAt?: string | Date;
  callDurationSeconds?: number;
  imageUrl?: string;
  imageMeta?: {
    fileName: string;
    fileSize: string;
  };
  user?: Pick<
    UmojaLinnUser,
    "firstName" | "lastName" | "profilePhotoUri" | "id"
  >;
  type: "MESSAGE" | "NOTIFICATION" | "CALL_JOIN" | "CALL_END";
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

export type NewUmojaLinnProjectReview = {
  projectId: string;
  projectTitle: string;
  allReviewsSubmitted: boolean;
  reviews: Array<UmojaLinnProjectReview>;
};

export type UmojaLinnSpecialistType = {
  id: string;
  name: string;
} & UmojaLinnTimestamp;

export type UmojaLinnPayment = {
  checkoutUrl: string;
  amount: number;
  currency: UmojaLinnCurrency;
};

export type UmojaLinnNgnBank = {
  id: string;
  name: string;
  code: string;
};

/** POST verify NGN bank account */
export type TVerifyNgnAccountPayload = {
  bankCode: string;
  accountNumber: string;
};

/** POST add NGN bank account */
export type TAddNgnBankAccountPayload = {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  otp: string;
};

/** POST /wallet/connect-stripe-account */
export type TConnectStripeAccountPayload = {
  otp: string;
};

/** POST /wallet/verify-connect-payment-account-otp */
export type TVerifyConnectPaymentAccountOtpPayload = {
  otp: string;
};

export type TRequestWithdrawalPayload = {
  currency: UmojaLinnCurrency;
  amount: number;
  otp: string;
};

/** POST /wallet/paystack/fee-estimate */
export type TPaystackFeeEstimatePayload = {
  amount: number;
  type: "transfer";
};

export type TPaystackFeeEstimate = {
  amount: number;
  fee: number;
  totalDebit: number;
  netToRecipient: number;
  currency: string;
  type: "transfer";
};

/** Payout address on payment account from GET /wallet/payment-account-info */
export type UmojaLinnPaymentAccountPayoutAddress = {
  id: string;
  userId: string | null;
  address: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  projectId: string | null;
  paymentAccountId: string | null;
} & UmojaLinnTimestamp;

export type UmojaLinnPaymentAccountInfo = {
  id: string;
  designerId: string;
  stripeAccountId: string | null;
  stripeStatus: string;
  stripeOnboardingUrl: string | null;
  stripePayoutsEnabled: boolean;
  stripeChargesEnabled: boolean;
  stripeDetailsSubmitted: boolean;
  stripeRequirements: string | null;
  stripeIban: string | null;
  stripeBankName: string | null;
  stripeBankCurrency: string | null;
  paystackRecipientCode: string;
  paystackStatus: string;
  paystackBankCode: string;
  paystackAccountNumber: string;
  paystackAccountName: string;
  address?: UmojaLinnPaymentAccountPayoutAddress | null;
};

export type UmojaLinnBankVerified = {
  accountName: string;
  accountNumber: string;
};
export type UmojaLinnConnectStripeAccount = {
  onboardingUrl: string;
  accountId: string;
};

/** POST /wallet/add-payment-address */
export type TAddPaymentAddressPayload = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

/** DELETE /wallet/stripe-connected-account */
export type TPaymentAccountProvider = "STRIPE" | "PAYSTACK";

/** DELETE /wallet/payment-account */
export type TDeletePaymentAccountPayload = {
  otp: string;
  provider: TPaymentAccountProvider;
};

/** @deprecated use TDeletePaymentAccountPayload */
export type TDeleteStripeConnectedAccountPayload = TDeletePaymentAccountPayload;

export type UmojaLinnSharedWorkImage = {
  imageUrl: string;
  description: string;
  isCoverImage: boolean;
};

export type UmojaLinnSharedWork = {
  id: string;
  designerId: string;
  images: UmojaLinnSharedWorkImage[];
  clothingTypes: Array<{ id: string; name: string } & UmojaLinnTimestamp>;
} & UmojaLinnTimestamp;
