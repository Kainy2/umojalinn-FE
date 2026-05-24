import { paymentAccountOtpFormSchema } from "@/lib/schema";
import { z } from "zod";

export type TEditStripeAccountOtpFormValues = z.infer<
  typeof paymentAccountOtpFormSchema
>;

export interface IEditStripeAccountOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stripeOnboardingUrl?: string | null;
  onNoOnboardingUrl?: () => void;
}
