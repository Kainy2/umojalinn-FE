import { stripeLinkAddressFormSchema } from "@/lib/schema";
import { z } from "zod";

export type TStripeLinkAddressFormValues = z.infer<
  typeof stripeLinkAddressFormSchema
>;

export interface ILinkStripeAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressSaved?: () => void;
}
