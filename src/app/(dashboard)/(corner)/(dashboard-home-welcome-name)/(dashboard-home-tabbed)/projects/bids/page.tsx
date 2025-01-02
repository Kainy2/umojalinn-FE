import BidCard from "@/components/custom/card/Bid";
import { MOCK_BIDS } from "@/data/bid";
import React from "react";

const BidPage = () => {
  return (
    <div className="flex flex-col">
      {MOCK_BIDS.map((bid) => (
        <BidCard key={bid.id} bid={bid} disabled={bid.id === "bid-002"} />
      ))}
    </div>
  );
};

export default BidPage;
