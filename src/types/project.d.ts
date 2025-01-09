import { UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnCurrency = "EURO" | "NAIRA";

export type UmojaLinnProject = {
  id: string;
  title: null | string;
  about: null | string;
  gender: null | "MALE" | "FEMALE";
  additionalNotes: null | string;
  dueDate: null | string;
  projectType: "PRIVATE" | "PUBLIC";
  status: "DRAFT" | "ADS" | "LIVE" | "COMPLETED";
  buyerId: string;
  designerId: string;
  budget: number | null | string;
  currency: null | UmojaLinnCurrency;
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
} & UmojaLinnTimestamp;

export type UmojaLinnDeliveryMethod =
  | "TRACKED"
  | "NON_TRACKED"
  | "IN_PERSON_PICKUP";

export type UmojaLinnMilestone = {
  id: string;
  title: string;
  description: string;
  amount: null | number;
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
  height: number | null;
  neckCircumference: number | null;
  shoulderWidth: number | null;
  upperChestCircumference: number | null;
  chestCircumference: number | null;
  upperArmCircumference: number | null;
  armLength: number | null;
  wristCircumference: number | null;
  backWidth: number | null;
  hipsCircumference: number | null;
  crotchDepth: number | null;
  neckToWaistline: number | null;
  waist: number | null;
  inseam: number | null;
  waistToKnee: number | null;
  kneeCircumference: number | null;
  ankleCircumference: number | null;
  napeToWaist: number | null;
  waistToFloor: number | null;
  thighCircumference: number | null;
  neckToAnkle: number | null;
  calfCircumference: number | null;
};

export type UmojaLinnFemaleSizingTemplateProps = {
  height: number | null;
  neckSize: number | null;
  totalBust: number | null;
  highestPointOfHips: number | null;
  widestPointOfHips: number | null;
  thigh: number | null;
  upperArmCircumference: number | null;
  armLength: number | null;
  shoulderWidth: number | null;
  bodyRise: number | null;
  neckToAnkle: number | null;
  waist: number | null;
  inseam: number | null;
  backLength: number | null;
  outseam: number | null;
  ankleCircumference: number | null;
  calfCircumference: number | null;
  wristCircumference: number | null;
  waistToFloor: number | null;
};

export type UmojaLinnSizingTemplate = {
  id: string;
  buyerId: string;
  name: string;
  unit: "CM" | "INCH";
  gender: "MALE" | "FEMALE";
  status: "DRAFT";
  buyer?: UmojaLinnUserRoleProfile;
  projects: UmojaLinnProject[];
} & Partial<
  UmojaLinnMaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
> &
  UmojaLinnTimestamp;
