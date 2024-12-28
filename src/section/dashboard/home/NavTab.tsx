"use client";
import CustomTab, { CustomTabItemProps } from "@/components/custom/Tab";
import { UmojaLinnUserRole } from "@/types/user";
import { usePathname } from "next/navigation";
import React from "react";

const DESIGNER_HOME_TAB_NAV: CustomTabItemProps[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Private jobs", href: "/dashboard/private-jobs" },
];

const BUYER_HOME_TAB_NAV: CustomTabItemProps[] = [
  { title: "Active", href: "/projects" },
  { title: "Ads", href: "/projects/ads" },
  { title: "Bids", href: "/projects/bids" },
  { title: "Drafts", href: "/projects/drafts" },
  { title: "Completed", href: "/projects/completed" },
];

const NavTab = (props: { role: UmojaLinnUserRole }) => {
  const pathName = usePathname();

  const tabs =
    props.role === "DESIGNER" ? DESIGNER_HOME_TAB_NAV : BUYER_HOME_TAB_NAV;

  return (
    <>
      <CustomTab
        type="NAVIGATOR"
        tabs={tabs}
        active={
          tabs?.find(
            (tab) =>
              tab?.href?.toLocaleLowerCase() === pathName?.toLocaleLowerCase()
          )?.title || ""
        }
      />
    </>
  );
};

export default NavTab;
