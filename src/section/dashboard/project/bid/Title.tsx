"use client";
import SectionTitle from "@/components/custom/SectionTitle";
import { MOCK_BIDS } from "@/data/bid";
import { User } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const BidTitle = () => {
  const { id } = useParams<{ id: string }>();
  const bid = MOCK_BIDS.find((val) => val.id === id);

  return (
    <SectionTitle
      icon={<User />}
      title={bid?.project?.title || "No title"}
      size="large"
    />
  );
};

export default BidTitle;
