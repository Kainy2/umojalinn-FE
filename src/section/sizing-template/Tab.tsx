"use client";
import CustomTab from "@/components/custom/tab";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

const SizigTemplateTab = () => {
  const { data: session } = useSession();
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

  if (!session?.user?.profileRole) return null;

  if (session?.user?.profileRole === "DESIGNER") {
    return (
      <p className="text-foreground-body mb-4">
        All active project templates will be be displayed here
      </p>
    );
  }

  return (
    <CustomTab
      className="mb-4 mt-7"
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
