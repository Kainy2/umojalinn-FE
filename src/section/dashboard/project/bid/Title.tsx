"use client";
import SectionTitle from "@/components/custom/SectionTitle";

import { User } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useGetBidById } from "@/tanstack/hooks/useBid";

const BidTitle = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData, isPending } = useGetBidById(id);

  const bid = bidData?.data?.data;

  const project = bid?.project;

  return (
    <SectionTitle
      loading={isPending}
      icon={<User />}
      title={project?.title || "No title"}
      size="large"
    />
  );
};

export default BidTitle;
