import { UmojaLinnCurrency } from "@/types/project";

export interface IWalletReceivingAccount {
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  bankSwiftCode: string;
  swiftNote?: string;
  accountType: string;
  bankAddress: string;
}

export interface IInsufficientWalletBalanceProps {
  refundAmount: number;
  availableBalance: number;
  currency?: UmojaLinnCurrency | null;
  receivingAccount: IWalletReceivingAccount;
  onSubmit: (receipt: FileList) => void;
  isPending?: boolean;
}
