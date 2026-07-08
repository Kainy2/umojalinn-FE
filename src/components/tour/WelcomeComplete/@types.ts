import type { UmojaLinnUserRole } from "@/types/user";

export interface IWelcomeCompleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileRole?: UmojaLinnUserRole | null;
  onInviteClient: () => void;
  onCreateProject: () => void;
}
