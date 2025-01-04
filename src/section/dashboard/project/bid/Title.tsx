"use client";
import SectionTitle from "@/components/custom/SectionTitle";

import { User } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { BidTabProps } from "./tab";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useGetBidById } from "@/tanstack/hooks/useBid";

const BidTitle = (props: BidTabProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData } = useGetBidById(id);
  const bid = bidData?.data?.data;
  const { data } = useGetProjectById(id);
  const project = props?.page === "create" ? data?.data?.data : bid?.project;

  return (
    <SectionTitle
      icon={<User />}
      title={project?.title || "No title"}
      size="large"
    />
  );
};

export default BidTitle;
