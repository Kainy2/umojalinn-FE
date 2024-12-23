"use client";
import CustomTab from "@/components/custom/Tab";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const ProjectTab = () => {
  const path = usePathname();
  const params = useParams<{ id: string }>();

  const tabs = useMemo(
    () => [
      {
        title: "Project Description",
        href: `/project/${params.id}`,
      },
      {
        title: "Gallery",
        href: `/project/${params.id}/gallery`,
      },
      {
        title: "Requirements & Budget",
        href: `/project/${params.id}/requirements-and-budget`,
      },
      {
        title: "Review",
        href: `/project/${params.id}/review`,
      },
    ],
    [params.id]
  );

  const active = useMemo(
    () => tabs.find((tab) => tab.href === path)?.title || "",
    [path, tabs]
  );

  return <CustomTab active={active} tabs={tabs} />;
};

export default ProjectTab;
