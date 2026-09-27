import { DialogProps } from "@radix-ui/react-dialog";

export interface IBuyerIssueConfirmDialogProps extends DialogProps {
  designerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}
