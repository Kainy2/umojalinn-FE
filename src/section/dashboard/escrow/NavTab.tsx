"use client";
import CustomTab, { CustomTabItemProps } from "@/components/custom/tab";
import { usePathname } from "next/navigation";
import React from "react";

const ESCROW_TAB_NAV: CustomTabItemProps[] = [
  {
    title: "Active projects",
    href: "/escrow",
    match: /^\/escrow\/(?!paid-out$).*/,
  },
  {
    title: "Paid Out",
    href: "/escrow/paid-out",
    match: /^\/escrow\/paid-out$/,
  },
];

const EscrowNavTab = () => {
  const pathName = usePathname();
  return (
    <>
      <CustomTab
        type="NAVIGATOR"
        tabs={ESCROW_TAB_NAV}
        className="mb-4"
        active={
          ESCROW_TAB_NAV?.find(
            (tab) =>
              tab?.href?.toLocaleLowerCase() ===
                pathName?.toLocaleLowerCase() ||
              tab?.match?.test(pathName?.toLocaleLowerCase()),
          )?.title || ""
        }
        mobileSelector
      />
    </>
  );
};

export default EscrowNavTab;
