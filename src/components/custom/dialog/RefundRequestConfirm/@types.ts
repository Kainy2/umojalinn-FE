import { DialogProps } from "@radix-ui/react-dialog";

export interface IRefundRequestConfirmDialogProps extends DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}
