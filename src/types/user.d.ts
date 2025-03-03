import { UmojaLinnTimestamp } from "./util";

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
  languages: [];
  specialistType: null | string;
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
} & UmojaLinnTimestamp;

export type UmojaLinnLoginResponse = {
  authToken: string;
  user: UmojaLinnUser;
};

export type UmojaLinnNotification = {
  id: string;
  userId: string;
  isRead: boolean;
  message: string;
  metadata?: {
    projectId?: string;
    projectName?: string;
  };
  senderName: string;
  senderProfileUrl: null | string;
} & UmojaLinnTimestamp;
