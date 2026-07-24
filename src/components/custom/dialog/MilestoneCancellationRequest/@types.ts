import { TMilestoneOption } from "@/components/custom/dialog/RefundRequest/@types";
import { TDisputeReason } from "@/types/dispute";
import { UmojaLinnCurrency } from "@/types/project";
import { DialogProps } from "@radix-ui/react-dialog";

export type TClientAwareness = "yes" | "no";

export type TRequestMilestoneCancellationPayload = {
  reason: TDisputeReason;
  isClientAware: boolean;
  media?: FileList | null;
};

export interface IMilestoneCancellationRequestDialogProps extends DialogProps {
  projectName: string;
  /** Fixed milestone (timeline entry). Omit when using `milestones`. */
  milestoneId?: string;
  milestoneName?: string;
  /** Project-level entry: designer picks which milestone to cancel. */
  milestones?: TMilestoneOption[];
  escrowAmount: number;
  currency?: UmojaLinnCurrency | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
