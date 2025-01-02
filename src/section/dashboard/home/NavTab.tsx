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
  {
    title: "Active",
    href: "/projects",
    match:
      /^(\/$|\/projects(?:\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(\/(chat|media-and-links|details))?$)/,
  },
  {
    title: "Ads",
    href: "/projects/ads",
    match:
      /^\/projects\/ads(\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/,
  },
  { title: "Bids", href: "/projects/bids" },
  {
    title: "Drafts",
    href: "/projects/drafts",
    match:
      /(^\/projects\/drafts$|^\/projects\/drafts\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$)/,
  },
  { title: "Completed", href: "/projects/completed" },
];

const NavTab = (props: {
  role?: UmojaLinnUserRole | null;
  className?: string;
}) => {
  const pathName = usePathname();

  const tabs =
    props.role === "DESIGNER" ? DESIGNER_HOME_TAB_NAV : BUYER_HOME_TAB_NAV;

  return (
    <>
      <CustomTab
        type="NAVIGATOR"
        tabs={tabs}
        className={props.className}
        active={
          tabs?.find(
            (tab) =>
              tab?.href?.toLocaleLowerCase() ===
                pathName?.toLocaleLowerCase() ||
              tab?.match?.test(pathName?.toLocaleLowerCase())
          )?.title || ""
        }
      />
    </>
  );
};

export default NavTab;
