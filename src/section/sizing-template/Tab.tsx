"use client";
import CustomTab from "@/components/custom/tab";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import React from "react";

const SizigTemplateTab = () => {
  const { data: allSizingTemplateData } = useGetAllSizingTemplates();
  const { data: inUseSizingTemplateData } = useGetAllSizingTemplates({
    sizingTemplateStatus: "IN_USE",
  });
  const { data: draftsSizingTemplateData } = useGetAllSizingTemplates({
    sizingTemplateStatus: "DRAFT",
  });
  return (
    <CustomTab
      className="mb-4"
      type="NAVIGATOR"
      active="All Templates"
      tabs={[
        {
          title: "All Templates",
          href: "/sizing-templates",
          count: allSizingTemplateData?.data?.data?.length,
        },
        {
          title: "Templates in use",
          href: "/sizing-templates/in-use",
          count: inUseSizingTemplateData?.data?.data?.length,
        },
        {
          title: "Drafts",
          href: "/sizing-templates/drafts",
          count: draftsSizingTemplateData?.data?.data?.length,
        },
      ]}
    />
  );
};

export default SizigTemplateTab;
