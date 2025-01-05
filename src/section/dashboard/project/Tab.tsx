"use client";
import CustomTab from "@/components/custom/Tab";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const ProjectTab = () => {
  const path = usePathname();
  const params = useParams<{ id: string }>();

  const tabs = useMemo(
    () => [
      {
        title: "Project Description",
        href: `/project/${uuidToBase62Safe(params.id)}`,
      },
      {
        title: "Gallery",
        href: `/project/${uuidToBase62Safe(params.id)}/gallery`,
      },
      {
        title: "Requirements & Budget",
        href: `/project/${uuidToBase62Safe(params.id)}/requirements-and-budget`,
      },
      {
        title: "Review",
        href: `/project/${uuidToBase62Safe(params.id)}/review`,
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
