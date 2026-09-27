import { UmojaLinnCurrency } from "@/types/project";
import { IWalletReceivingAccount } from "./@types";

const MOCK_USD_RECEIVING_ACCOUNT: IWalletReceivingAccount = {
  accountHolder: "Umoja linn",
  accountNumber: "12693871",
  routingNumber: "G 6938 71",
  bankSwiftCode: "TRWIGB2LXXX",
  swiftNote: "Only used for international Swift transfers",
  accountType: "Checking",
  bankAddress:
    "Wise Payments Limited, 1st Floor, Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom",
};

// TODO: Replace with GET /wallet/receiving-account/{currency} when API is ready
export const getMockReceivingAccount = (
  currency?: UmojaLinnCurrency | null,
): IWalletReceivingAccount => {
  void currency;
  return MOCK_USD_RECEIVING_ACCOUNT;
};
