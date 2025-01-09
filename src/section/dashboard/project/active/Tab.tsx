"use client";
import CustomTab from "@/components/custom/tab";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const ActiveProjectTab = () => {
  const path = usePathname();
  const params = useParams<{ id: string }>();

  const { data } = useGetProjectById(params.id);

  const tabs = useMemo(
    () => [
      {
        title: "Activities",
        href: `/projects/${uuidToBase62Safe(params.id)}`,
      },
      // {
      //   title: "Chat",
      //   href: `/projects/${uuidToBase62Safe(params.id)}/chat`,
      // },
      {
        title: "Media & links",
        href: `/projects/${uuidToBase62Safe(params.id)}/media-and-links`,
      },
      {
        title: "Details",
        href: `/projects/${uuidToBase62Safe(params.id)}/details`,
      },
    ],
    [params.id]
  );

  const active = useMemo(
    () => tabs.find((tab) => tab.href === path)?.title || "",
    [path, tabs]
  );

  if (!data?.data?.data) {
    return null;
  }

  return <CustomTab replace type="NAVIGATOR" active={active} tabs={tabs} />;
};

export default ActiveProjectTab;
