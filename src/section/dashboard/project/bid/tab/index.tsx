"use client";
import CustomTab from "@/components/custom/Tab";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import BidTabProjectDetailsSection from "./ProjectDetails";
import BidTabHistorySection from "./History";

export type BidTabProps = { page?: "create" | "view"; edit?: boolean };

const BidTab = (props: BidTabProps) => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
            {
              title: "Project details",
              href: `${pathname}`,
            },
            {
              title: "Bid history",
              href: `${pathname}?tab=history`,
            },
          ],
    [id, props.page, pathname]
  );

  const isHistoryTab = useMemo(
    () => searchParams?.get("tab")?.toLocaleLowerCase?.() === "history",
    [searchParams]
  );

  return (
    <div className="">
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
        <BidTabProjectDetailsSection />
      )}
    </div>
  );
};

export default BidTab;
