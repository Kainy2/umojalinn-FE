"use client";
import CustomTab from "@/components/custom/tab";
import { usePathname } from "next/navigation";
import React from "react";

const JOB_TABS = [
  { title: "Private Jobs", href: "/jobs", match: /^\/jobs$/ },
  {
    title: "Consultations",
    href: "/jobs/consultations",
    match: /^\/jobs\/consultations(\/[A-Za-z0-9_-]+)?$/,
  },
];

const JobsTab = () => {
  const pathname = usePathname();
  const active =
    JOB_TABS.find(
      (tab) =>
        tab.href === pathname || tab.match?.test(pathname),
    )?.title ?? "Private Jobs";

  return (
    <CustomTab
      active={active}
      type="NAVIGATOR"
      tabs={JOB_TABS}
    />
  );
};

export default JobsTab;
