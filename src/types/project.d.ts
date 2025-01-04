import { UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnCurrency = "EURO" | "NAIRA";

export type UmojaLinnProject = {
  id: string;
  title: null | string;
  about: null | string;
  gender: null | string;
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
  history: Omit<UmojaLinnBid, "history" | "deliveryMilestone">[];
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
