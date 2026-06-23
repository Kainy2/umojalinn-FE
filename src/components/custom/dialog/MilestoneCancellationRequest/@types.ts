import { TDisputeReason, TMilestoneDisputeType } from "@/types/dispute";
import { UmojaLinnCurrency } from "@/types/project";
import { DialogProps } from "@radix-ui/react-dialog";

export type TClientAwareness = "yes" | "no";

export type TRequestMilestoneCancellationPayload = {
  reason: TDisputeReason;
  isClientAware: boolean;
  media?: FileList | null;
};

export interface IMilestoneCancellationRequestDialogProps extends DialogProps {
  milestoneId: string;
  projectName: string;
  milestoneName: string;
  escrowAmount: number;
  currency?: UmojaLinnCurrency | null;
  disputeType: TMilestoneDisputeType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
