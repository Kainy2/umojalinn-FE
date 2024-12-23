import { UmojaLinnUserRoleProfile } from "./user";
import { UmojaLinnTimestamp } from "./util";

export type UmojaLinnProject = {
  id: string;
  title: null | string;
  additionalNotes: null | string;
  dueDate: null | string;
  projectType: "PRIVATE" | "PUBLIC";
  buyerId: string;
  designerId: string;
  budget: null | string;
  currency: null | string;
  negotiable: null | boolean;
  specialistTypeId: null | string;
  buyer: Pick<
    UmojaLinnUserRoleProfile,
    "id" | "userId" | "profileStrength" | "createdAt" | "updatedAt"
  >;
  designer: Pick<
    UmojaLinnUserRoleProfile,
    | "id"
    | "userId"
    | "profileStrength"
    | "createdAt"
    | "updatedAt"
    | "isAvailable"
  >;
} & UmojaLinnTimestamp;
