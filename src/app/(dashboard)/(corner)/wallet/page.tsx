"use client";
import WalletCard from "@/components/custom/card/Wallet";
import { Separator } from "@/components/ui/separator";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import React from "react";

const WithdrawalPage = () => {
  const { data: walletData } = useGetWallet();
  const wallet = walletData?.data?.data;

  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Wallet</h1>
      <div className="flex h-full">
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
            <WalletCard
              subtitle="Money in Escrow"
              currency="EURO"
              value={0}
              noAction
            />
          </div>
        </div>
        <div className="flex-1 shrink-0  lg:max-w-[500px] p-8 border border-border/50">
          <h2 className="font-semibold mb-2">Recent transactions</h2>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-center h-[30vh] text-gray-500 text-sm">
            <p>No transaction data</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawalPage;
