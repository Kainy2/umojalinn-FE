import { DialogProps } from "@radix-ui/react-dialog";

export interface IOppositeGenderSizingWarningProps extends DialogProps {
  description: string;
  onConfirm: () => void;
  pendingConfirm?: boolean;
  title?: string;
}
