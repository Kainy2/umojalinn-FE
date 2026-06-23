import { UmojaLinnCurrency } from "@/types/project";

export interface IWalletDisputeHeldTagProps {
  currency: UmojaLinnCurrency;
  amount: number;
  hideBalance?: boolean;
  className?: string;
}
