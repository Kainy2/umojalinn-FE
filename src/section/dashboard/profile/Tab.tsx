"use client";
import { CustomTabItemProps } from "@/components/custom/tab";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

const BUYER_PROFILE_NAV: CustomTabItemProps[] = [
  {
    title: "My details",
    href: "/settings/profile",
    value: "/settings/profile",
  },
  {
    title: "Work History",
    href: "/settings/profile/work-history",
    value: "/settings/profile/work-history",
  },
];

const DESIGNER_PROFILE_NAV: CustomTabItemProps[] = [
  {
    title: "My details",
    href: "/settings/profile",
    value: "/settings/profile",
  },
  // {
  //   title: "Portfolio",
  //   href: "/settings/profile/portfolio",
  //   value: "/settings/profile/portfolio",
  // },
  {
    title: "Work History",
    href: "/settings/profile/work-history",
    value: "/settings/profile/work-history",
  },
];

const ProfileTab = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <TabButtonSelect
      type="NAVIGATOR"
      size="large"
      active={pathname}
      className="mb-12"
      tabs={
        session?.user?.profileRole === "DESIGNER"
          ? DESIGNER_PROFILE_NAV
          : BUYER_PROFILE_NAV
      }
    />
  );
};

export default ProfileTab;
