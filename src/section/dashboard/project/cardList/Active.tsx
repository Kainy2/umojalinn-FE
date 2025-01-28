"use client";
import CustomCard from "@/components/custom/card";
import CustomCardHolder from "@/components/custom/card/Holder";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
} from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

type ActiveProjectCardListProps = {
  baseUrlSlug?: "projects" | "active-jobs";
};

const ActiveProjectCardList = (props: ActiveProjectCardListProps) => {
  const { baseUrlSlug = "projects" } = props;
  const params = useParams<{ id: string }>();
  const { data: buyerProjects, isPending: loadingBuyerProjects } =
    useGetAllBuyerProject(
      {
        projectStatus: "LIVE",
      },
      {
        enabled: baseUrlSlug === "projects",
      }
    );
  const { data: designerProjects, isPending: loadingDesignerProjects } =
    useGetAllDesignerProject(
      {
        projectStatus: "LIVE",
      },
      {
        enabled: baseUrlSlug === "active-jobs",
      }
    );

  const projectsData = (
    baseUrlSlug === "projects" ? buyerProjects : designerProjects
  )?.data?.data;

  const isPending =
    baseUrlSlug === "projects" ? loadingBuyerProjects : loadingDesignerProjects;

  return (
    <CustomCardHolder type="PROJECT" loading={isPending}>
      {projectsData?.map((project) => (
        <CustomCard
          key={project?.id}
          preTitle={
            uuidToBase62Safe(params?.id) === uuidToBase62Safe(project?.id)
          }
          img={
            project?.Gallery?.find((gallery) => gallery.isCoverImage)?.imageUrl
          }
          title={project.title || "No title"}
          type="PROJECT"
          href={
            uuidToBase62Safe(params?.id) === uuidToBase62Safe(project?.id)
              ? `/${baseUrlSlug}`
              : `/${baseUrlSlug}/${uuidToBase62Safe(project?.id)}`
          }
        />
      ))}
    </CustomCardHolder>
  );
};

export default ActiveProjectCardList;
