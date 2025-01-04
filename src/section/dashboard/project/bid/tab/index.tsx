"use client";
import CustomTab from "@/components/custom/Tab";
import { useParams, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import BidTabProjectDetailsSection from "./ProjectDetails";
import BidTabHistorySection from "./History";

export type BidTabProps = { page?: "create" | "view" };

const BidTab = (props: BidTabProps) => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const tabs = useMemo(
    () =>
      props.page === "create"
        ? [
            { title: "Project details", href: `/jobs/${id}/bid` },
            {
              title: "Bid history",
              href: `/jobs/${id}/bid?tab=history`,
            },
          ]
        : [
            { title: "Project details", href: `/bids/${id}` },
            {
              title: "Bid history",
              href: `/bids/${id}?tab=history`,
            },
          ],
    [id, props.page]
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
        replace
      />
      {isHistoryTab ? (
        <BidTabHistorySection />
      ) : (
        <BidTabProjectDetailsSection {...props} />
      )}
    </>
  );
};

export default BidTab;
