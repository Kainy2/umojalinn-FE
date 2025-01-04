"use client";
import BidCard from "@/components/custom/card/Bid";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBuyerBids } from "@/tanstack/hooks/useBid";
import React from "react";

const BidPage = () => {
  const { data, isPending } = useGetBuyerBids();

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data?.data?.data?.map((bid) => (
        <BidCard key={bid.id} bid={bid} />
      ))}
    </div>
  );
};

export default BidPage;
