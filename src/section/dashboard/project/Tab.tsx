"use client";
import CustomTab from "@/components/custom/tab";
import { uuidToBase62Safe } from "@/lib/uuid";
import { ProjectFormProps } from "@/section/form/project/edit/Description";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const ProjectTab = (props: Pick<ProjectFormProps, "isOnboarding">) => {
  const path = usePathname();
  const params = useParams<{ id: string }>();

  const tabs = useMemo(
    () => [
      {
        title: "Project Description",
        href: `${
          !!props.isOnboarding ? "/onboard" : ""
        }/project/${uuidToBase62Safe(params?.id)}`,
      },
      {
        title: "Gallery",
        href: `${
          !!props.isOnboarding ? "/onboard" : ""
        }/project/${uuidToBase62Safe(params?.id)}/gallery`,
      },
      {
        title: "Requirements & Budget",
        href: `${
          !!props.isOnboarding ? "/onboard" : ""
        }/project/${uuidToBase62Safe(params?.id)}/requirements-and-budget`,
      },
      {
        title: "Review",
        href: `${
          !!props.isOnboarding ? "/onboard" : ""
        }/project/${uuidToBase62Safe(params?.id)}/review`,
      },
    ],
    [params?.id, props.isOnboarding]
  );

  const active = useMemo(
    () => tabs.find((tab) => tab.href === path)?.title || "",
    [path, tabs]
  );

  return <CustomTab active={active} tabs={tabs} />;
};

export default ProjectTab;
