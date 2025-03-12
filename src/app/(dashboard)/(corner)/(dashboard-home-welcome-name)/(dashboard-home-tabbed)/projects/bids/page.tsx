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
        {new Array(4).fill("").map((_, i) => (
          <Skeleton className="h-32" key={i} />
        ))}
      </div>
    );
  }

  if (!data?.data?.data?.length) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-muted-foreground">
        <span>No Bids available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data?.data?.data?.map((bid) => (
        <BidCard key={bid?.id} bid={bid} />
      ))}
    </div>
  );
};

export default BidPage;
