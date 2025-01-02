"use client";
import CustomTab from "@/components/custom/Tab";
import { useParams, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import BidTabProjectDetailsSection from "./ProjectDetails";
import BidTabHistorySection from "./History";

const BidTab = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const tabs = useMemo(
    () => [
      { title: "Project details", href: `/bids/${id}` },
      {
        title: "Bid history",
        href: `/bids/${id}?tab=history`,
      },
    ],
    [id]
  );

  const isHistoryTab = useMemo(
    () => searchParams?.get("tab")?.toLocaleLowerCase?.() === "history",
    [searchParams]
  );

  return (
    <>
      <CustomTab
        className="mb-4"
        tabs={tabs}
        type="NAVIGATOR"
        active={isHistoryTab ? tabs[1].title : tabs[0].title}
      />
      {isHistoryTab ? (
        <BidTabHistorySection />
      ) : (
        <BidTabProjectDetailsSection />
      )}
    </>
  );
};

export default BidTab;
