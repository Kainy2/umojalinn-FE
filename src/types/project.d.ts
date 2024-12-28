import { UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnProject = {
  id: string;
  title: null | string;
  about: null | string;
  gender: null | string;
  additionalNotes: null | string;
  dueDate: null | string;
  projectType: "PRIVATE" | "PUBLIC";
  buyerId: string;
  designerId: string;
  budget: null | string;
  currency: null | string;
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
