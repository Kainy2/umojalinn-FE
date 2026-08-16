import { languageProficiency } from "@/lib/schema";
import { UmojaLinnTimestamp } from "./util";
import { UmojaLinnProject, UmojaLinnProjectReview, UmojaLinnSharedWork, WorkHistory } from "./project";
import type { TGuidedTourStep } from "@/constant/tour/@types";

export type UmojaLinnUserRole = "BUYER" | "DESIGNER";

export type UmojaLinnProjectInvitation = {
  id: string;
  buyerProfileId: string | null;
  designerProfileId: string | null;
  buyerEmail: string;
  status: "PENDING" | "SUCCESS";
  buyerProfile: {
    user: Pick<UmojaLinnUser, "firstName" | "lastName" | "id" | "email">;
  } | null;
} & UmojaLinnTimestamp;

export type UmojaLinnUserRoleProfile = {
  id: string;
  userId: string;
  profileStrength: number;
  isAvailable: boolean;
  projectInvitations: UmojaLinnProjectInvitation[];
  user: null | UmojaLinnUser;
  numberOfTemplates?: number;
} & UmojaLinnTimestamp;

export type UmojaLinnUserDesignerAddonProfile = {
  clothingTypes: Array<
    {
      id: string;
      name: string;
    } & UmojaLinnTimestamp
  > | null;
  experienceLevel: null | string;
  about: null | string;
  brandName: null | string;
  specialistTypeId: null | string;
  languages: {
    name: string;
    languageProficiency: (typeof languageProficiency)[number];
  }[];
  specialistType: null | {
    createdAt: string;
    id: string;
    name: string;
    updatedAt: string;
  };
};

export type UmojaLinnUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  alternativeEmail: null | string;
  role: UmojaLinnUserRole;
  gender: null | string;
  address: null | Partial<{
    zipCode: string;
    address: string;
    country: string;
    state: string;
    city: string;
  }>;
  tag: string;
  dateOfBirth: null | Date | string;
  phoneNumber: null | string;
  profilePhotoUri: null | string;
  authProvider: string;
  buyerProfile: null | UmojaLinnUserRoleProfile;
  designerProfile:
    | null
    | (UmojaLinnUserRoleProfile & UmojaLinnUserDesignerAddonProfile);
  verified: boolean;
  guidedTourCompletedAt: null | string;
  guidedTourProgress: null | {
    designer?: Partial<Record<TGuidedTourStep, string>>;
    buyer?: Partial<Record<TGuidedTourStep, string>>;
  };
} & UmojaLinnTimestamp;

export type UmojaLinnLoginResponse = {
  authToken: string;
  user: UmojaLinnUser;
};

export type UmojaLinnDesignerProfile = {
  id: string;
  userId: string;
  brandName: string | null;
  isAvailable: boolean;
  about: string | null;
  experienceLevel: string | null;
  averageRating: number;
  profileStrength: number;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    tag?: string;
    profilePhotoUri: string | null;
    address: { country?: string; city?: string; state?: string } | null;
  };
  clothingTypes: Array<{ id: string; name: string } & UmojaLinnTimestamp>;
  specialistType: { id: string; name: string } | null;
  designerSharedWork: UmojaLinnSharedWork[];
  reviews?: UmojaLinnProjectReview[];
  workHistory?: WorkHistory;
  projectInvitations: unknown[];
  projects: UmojaLinnProject[];
  bids: UmojaLinnBid[];
  languages: unknown[];
  inviterTag?: string;
};

export type UmojaLinnPreviousHire = {
  id: string;
  userId: string;
  experienceLevel: string | null;
  about: string | null;
  brandName: string | null;
  specialistTypeId: string | null;
  profileStrength: number;
  isAvailable: boolean;
  tier: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    tag: string;
    firstName: string;
    lastName: string;
    profilePhotoUri: string | null;
    address: { country?: string; city?: string; state?: string } | null;
  };
  clothingTypes: Array<{ id: string; name: string }>;
  specialistType: { id: string; name: string } | null;
  portfolioCoverImages?: string[];
};

export type UmojaLinnNotification = {
  id: string;
  userId: string;
  isRead: boolean;
  message: string;
  metadata?: {
    projectId?: string;
    projectName?: string;
    bidId?: string;
    projectStatus?: UmojaLinnProject["status"];
    buttonText?: string;
    buttonUrl?: string;
  };
  senderName: string;
  senderProfileUrl: null | string;
} & UmojaLinnTimestamp;
