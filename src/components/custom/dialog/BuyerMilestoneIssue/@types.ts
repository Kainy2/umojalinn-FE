import { DialogProps } from "@radix-ui/react-dialog";

export interface IBuyerMilestoneIssueDialogProps extends DialogProps {
  milestoneId: string;
  projectName: string;
  milestoneName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
