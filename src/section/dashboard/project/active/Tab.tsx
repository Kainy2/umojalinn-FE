"use client";
import CustomTab from "@/components/custom/tab";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

type ActiveProjectTabProps = {
  baseUrlSlug?: "projects" | "active-jobs";
};

const ActiveProjectTab = (props: ActiveProjectTabProps) => {
  const { baseUrlSlug = "projects" } = props;
  const path = usePathname();
  const params = useParams<{ id: string }>();

  const { data } = useGetProjectById(params?.id);

  const tabs = useMemo(
    () => [
      {
        title: "Activities",
        href: `/${baseUrlSlug}/${uuidToBase62Safe(params?.id)}`,
      },
      // {
      //   title: "Chat",
      //   href: `/${baseUrlSlug}/${uuidToBase62Safe(params?.id)}/chat`,
      // },
      // {
      //   title: "Media & links",
      //   href: `/${baseUrlSlug}/${uuidToBase62Safe(params?.id)}/media-and-links`,
      // },
      {
        title: "Details",
        href: `/${baseUrlSlug}/${uuidToBase62Safe(params?.id)}/details`,
      },
    ],
    [baseUrlSlug, params?.id]
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
