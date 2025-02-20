"use client";
import CustomTab from "@/components/custom/tab";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import { usePathname } from "next/navigation";
import React from "react";

const SizigTemplateTab = () => {
  const { data: allSizingTemplateData } = useGetAllSizingTemplates();
  const { data: inUseSizingTemplateData } = useGetAllSizingTemplates({
    sizingTemplateStatus: "IN_USE",
  });
  const { data: draftsSizingTemplateData } = useGetAllSizingTemplates({
    sizingTemplateStatus: "DRAFT",
  });
  const pathname = usePathname();

  const tabs = [
    {
      title: "All Templates",
      href: "/sizing-templates",
      count: allSizingTemplateData?.data?.data?.length || undefined,
    },
    {
      title: "Templates in use",
      href: "/sizing-templates/in-use",
      count: inUseSizingTemplateData?.data?.data?.length || undefined,
    },
    {
      title: "Drafts",
      href: "/sizing-templates/drafts",
      count: draftsSizingTemplateData?.data?.data?.length || undefined,
    },
  ];

  return (
    <CustomTab
      className="mb-4"
      type="NAVIGATOR"
      active={
        tabs?.find(
          (tab) =>
            tab?.href?.toLocaleLowerCase?.() === pathname?.toLocaleLowerCase?.()
        )?.title || ""
      }
      tabs={tabs}
    />
  );
};

export default SizigTemplateTab;
