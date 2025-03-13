"use client";
import WalletCard, { EscrowCard } from "@/components/custom/card/Wallet";
import { Separator } from "@/components/ui/separator";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import { UmojalinnWalletTransaction } from "@/types/project";
import React from "react";

import Paypal from "@/icons/Paypal";
import Bank from "@/icons/Bank";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { formatCurrencyValue } from "@/lib/number";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import { UmojaLinnUserRole } from "@/types/user";

const getTransactionIcon = (
  channel: UmojalinnWalletTransaction["paymentChannel"],
) => {
  switch (channel) {
    case "PAYPAL":
      return <Paypal />;
    case "DIRECT_TRANSFER":
    default:
      return <Bank />;
  }
};

const getTransactionStatus = (
  type: UmojalinnWalletTransaction["transactionType"],
  profileRole: UmojaLinnUserRole,
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

const WithdrawalPage = () => {
  const { data: walletData } = useGetWallet();
  const wallet = walletData?.data?.data;
  const { transactions } = wallet || {};
  const { data: session } = useSession();
  const isDesigner = session?.user?.profileRole === "DESIGNER";

  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Wallet</h1>
      <div className="flex h-full flex-col lg:flex-row">
        <div className="flex-1 shrink-0">
          <div className="flex flex-col gap-4">
            <WalletCard
              title="Naira balance"
              subtitle="Current balance"
              currency="NAIRA"
              value={wallet?.ngnBalance || 0}
              href="/wallet/withdraw/naira"
            />
            <WalletCard
              title="Euro balance"
              subtitle="Current balance"
              currency="EURO"
              value={wallet?.eurBalance || 0}
              href="/wallet/withdraw/euro"
            />
            {isDesigner && (
              <EscrowCard
                subtitle="Money in Escrows"
                value={{
                  EURO: wallet?.eurEscrowBalance || 0,
                  NAIRA: wallet?.ngnEscrowBalance || 0,
                }}
              />
            )}
          </div>
        </div>
        <div className="flex-1 shrink-0  lg:max-w-[500px] p-8 border border-border/50">
          <h2 className="font-semibold mb-2">Recent transactions</h2>
          <Separator className="bg-border/50" />
          {transactions?.map?.((trans: UmojalinnWalletTransaction) => {
            const isCredit =
              !!session?.user?.profileRole &&
              getTransactionStatus(
                trans?.transactionType,
                session?.user?.profileRole,
              );
            return (
              <div
                className="flex items-center text-foreground-body gap-1 border-b border-border/50 py-2"
                key={trans?.id}
              >
                {trans?.paymentChannel && (
                  <span>{getTransactionIcon(trans?.paymentChannel)}</span>
                )}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      {capitalizeFirstLetter(
                        trans?.transactionType?.replaceAll("_", " "),
                      )}
                    </p>
                    <p
                      className={
                        trans?.status === "PENDING"
                          ? "text-warning"
                          : isCredit
                          ? "text-success"
                          : "text-error"
                      }
                    >
                      {isCredit ? "+" : "-"}{" "}
                      {getCurrencySymbol(trans?.currency)}
                      {formatCurrencyValue(trans?.amount)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-foreground-body">
                      {trans?.project?.title}
                    </p>
                    <p className="text-sm">
                      {formatDate(trans?.createdAt, "dd/MM/yy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {!transactions?.length && (
            <div className="flex items-center justify-center h-[30vh] text-gray-500 text-sm">
              <p>No transaction data</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawalPage;
