import { stripeDisconnectOtpFormSchema } from "@/lib/schema";
import { TPaymentAccountProvider } from "@/types/project";
import { z } from "zod";

export type TStripeDisconnectOtpFormValues = z.infer<
  typeof stripeDisconnectOtpFormSchema
>;

export interface IDisconnectStripeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: TPaymentAccountProvider;
}
