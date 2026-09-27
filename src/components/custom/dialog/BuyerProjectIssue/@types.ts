import { TMilestoneOption } from "@/components/custom/dialog/RefundRequest/@types";
import { DialogProps } from "@radix-ui/react-dialog";
import { TBuyerIssueReason } from "@/types/dispute";

export type TBuyerProjectIssueFormData = {
  reason: TBuyerIssueReason;
  description: string;
  milestoneIds: string[];
  files: FileList | null;
};

export interface IBuyerProjectIssueDialogProps extends DialogProps {
  projectName: string;
  milestones: TMilestoneOption[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: TBuyerProjectIssueFormData) => void;
}
