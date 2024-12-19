"use client";
import CustomTab, { CustomTabItemProps } from "@/components/custom/Tab";
import { usePathname } from "next/navigation";
import React from "react";

const DESIGNER_HOME_TAB_NAV: CustomTabItemProps[] = [
  { title: "Dashboard", href: "/", count: 2 },
  { title: "Private jobs", href: "/dashboard/private-jobs" },
];

const NavTab = () => {
  const pathName = usePathname();

  return (
    <>
      <CustomTab
        type="NAVIGATOR"
        tabs={DESIGNER_HOME_TAB_NAV}
        active={
          DESIGNER_HOME_TAB_NAV?.find(
            (tab) =>
              tab?.href?.toLocaleLowerCase() === pathName?.toLocaleLowerCase()
          )?.title || ""
        }
      />
    </>
  );
};

export default NavTab;
