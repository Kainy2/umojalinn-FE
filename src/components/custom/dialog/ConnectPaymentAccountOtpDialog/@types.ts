import { paymentAccountOtpFormSchema } from "@/lib/schema";
import { z } from "zod";

export type TConnectPaymentAccountOtpFormValues = z.infer<
  typeof paymentAccountOtpFormSchema
>;

export type TConnectPaymentAccountOtpIntent = "stripe" | "ngn";

export interface IConnectPaymentAccountOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intent: TConnectPaymentAccountOtpIntent;
  onConfirm: (otp: string) => void;
  isConfirming?: boolean;
}
