import { TDisputeReason } from "@/types/dispute";
import { UmojaLinnCurrency } from "@/types/project";
import { DialogProps } from "@radix-ui/react-dialog";

export type TRefundType = "FULL" | "PARTIAL";

export type TMilestoneOption = {
  id: string;
  title: string;
  amount: number;
};

export type TRequestProjectRefundPayload = {
  milestoneIds: string[];
  refundType: TRefundType;
  amount?: number;
  reason: TDisputeReason;
  description: string;
  media?: FileList | null;
};

export interface IRefundRequestDialogProps extends DialogProps {
  projectId: string;
  projectName: string;
  milestones: TMilestoneOption[];
  currency?: UmojaLinnCurrency | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface IMilestoneMultiSelectProps {
  milestones: TMilestoneOption[];
  value: string[];
  onChange: (milestoneIds: string[]) => void;
  placeholder?: string;
}
