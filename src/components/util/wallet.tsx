import { UmojalinnWalletTransaction } from "@/types/project";

import Paypal from "@/icons/Paypal";
import Bank from "@/icons/Bank";
import { UmojaLinnUserRole } from "@/types/user";

export const getTransactionIcon = (
  channel: UmojalinnWalletTransaction["paymentChannel"]
) => {
  switch (channel) {
    case "PAYPAL":
      return <Paypal />;
    case "DIRECT_TRANSFER":
    default:
      return <Bank />;
  }
};


export const getTransactionStatus = (
  type: UmojalinnWalletTransaction["transactionType"],
  profileRole: UmojaLinnUserRole
) => {
  let creditList: UmojalinnWalletTransaction["transactionType"][] = [
    "FUND_ESCROW",
    "WALLET_TO_UP",
  ];

  if (profileRole === "DESIGNER") {
    creditList = [...creditList, "MILESTONE_COMPLETED"];
  }

  return creditList?.includes(type);
};