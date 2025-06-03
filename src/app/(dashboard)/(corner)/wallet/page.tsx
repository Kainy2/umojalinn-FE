"use client";
import WalletCard, { EscrowCard } from "@/components/custom/card/Wallet";
import { Separator } from "@/components/ui/separator";
import { useGetInfiniteTransactions, useGetWallet } from "@/tanstack/hooks/useProject";
import React from "react";

import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { formatCurrencyValue } from "@/lib/number";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import {
  getTransactionIcon,
  getTransactionStatus,
} from "@/components/util/wallet";
import { cn } from "@/lib/utils";
import { useInfiniteData } from "@/hooks/use-infinite-data";

const WithdrawalPage = () => {
  const { data: session } = useSession();
  const { data: walletData } = useGetWallet();
  const {
    data: allTransactions,
    isPending,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
   } = useGetInfiniteTransactions();
   const transactions = useInfiniteData(allTransactions)
  
  const wallet = walletData?.data?.data;

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
                subtitle="Money in Escrow"
                value={{
                  EURO: wallet?.eurEscrowBalance || 0,
                  NAIRA: wallet?.ngnEscrowBalance || 0,
                }}
              />
            )}
          </div>
        </div>
        <div className="flex-1 shrink-0  lg:max-w-[500px] max-h-[80vh] overflow-h-scroll p-8 border border-border/50">
          <h2 className="font-semibold mb-2">Recent transactions</h2>
          <Separator className="bg-border/50" />
          {transactions?.map?.((trans) => {
            const isCredit =
              !!session?.user?.profileRole &&
              getTransactionStatus(
                trans?.transactionType,
                session?.user?.profileRole
              );    
            const transactionSign= isCredit? "+": "-"
            const getColorClass = () => { 
              if (trans?.transactionType === "MILESTONE_COMPLETED") {
                return "text-success";
              } else if (trans?.transactionType === "WITHDRAWAL_REQUEST") {
                if (trans?.status === "SUCCESS") {
                  return "text-error";
                } else {
                  return "text-warning";
                } 
              } else {
                return "text-warning";
              }
            }

             const getTrxStatusText = () => {
                switch (trans?.status) {
                  case "FAILED":
                    return "rejected";
                  case "PENDING":
                    return "submitted";
                  case "SUCCESS":
                    return "approved";
                  default:
                    return "submitted";
                }
              };

              // trans?.transactionType?.replaceAll("_", " ")?.replaceAll("REQUEST", " ")?.replaceAll("COMPLETED", "approved ")

            return (
              <div
                className="flex items-center text-foreground-body gap-3 border-b border-border/50 py-2"
                key={trans?.id}
              >
                {trans?.paymentChannel && (
                  <div className="w-10">
                    {getTransactionIcon(trans?.paymentChannel)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {capitalizeFirstLetter(
                        trans?.transactionType
                        ?.replace(/_|REQUEST|COMPLETED/g, match =>
                          match === '_' ? ' ' :
                          match === 'REQUEST' ? '' :
                          match === 'COMPLETED' ? 'approved ' :
                          match
                        )
                      )}  
                      {
                        trans?.transactionType ===
                        "WITHDRAWAL_REQUEST"
                        ? getTrxStatusText()
                        :""          
                      }
                    </p>
                    <p className={getColorClass()}>
                      {`${
                        trans?.transactionType !==
                        "WITHDRAWAL_REQUEST"
                          ? transactionSign
                          : ""
                      }                
                      ${getCurrencySymbol(
                        trans?.currency
                      )}${formatCurrencyValue(trans?.amount)}`}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className={cn(
                      "text-sm text-foreground-body",
                      !trans.withdrawalMethod?.paypalEmail && "capitalize"
                    )}>
                      {trans.withdrawalMethod?.paypalEmail 
                      || trans?.project?.title 
                      || trans?.paymentChannel.replace("_", " ").toLowerCase() 
                      || ""}
                    </p>
                    <p className="text-sm">
                      {formatDate(trans?.createdAt, "dd/MM/yy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {hasNextPage && (
            <button
              onClick={()=> hasNextPage && fetchNextPage()}
              className="text-primary text-sm text-right block w-full mt-4 py-2 hover:text-primary/70 transition"
            >
              {isFetchingNextPage
                ? "loading more..."
                : "Show more"}
            </button>
          )}

          {!isPending && !transactions?.length && (
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
