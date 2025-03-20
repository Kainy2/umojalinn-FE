"use client";
import CustomCard from "@/components/custom/card";
import CustomCardHolder from "@/components/custom/card/Holder";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
} from "@/tanstack/hooks/useProject";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type ActiveProjectCardListProps = {
  baseUrlSlug?: "projects" | "active-jobs" | "escrow";
};

const ActiveProjectCardList = (props: ActiveProjectCardListProps) => {
  const { baseUrlSlug = "projects" } = props;
  const params = useParams<{ id: string }>();

  const pathName = usePathname();

  const { data: session } = useSession();

  const { data: buyerProjects, isPending: loadingBuyerProjects } =
    useGetAllBuyerProject(
      {
        projectStatus: "LIVE",
      },
      {
        enabled: baseUrlSlug === "projects",
      },
    );
  const { data: escrowBuyerProjects, isPending: loadingEscrowBuyerProjects } =
    useGetAllBuyerProject(
      {
        projectStatus: ["LIVE", "COMPLETED"],
      },
      {
        enabled:
          baseUrlSlug === "escrow" && session?.user?.profileRole === "BUYER",
      },
    );

  const {
    data: escrowDesignerProjects,
    isPending: loadingEscrowDesignerProjects,
  } = useGetAllDesignerProject(
    {
      projectStatus: ["LIVE", "COMPLETED"],
    },
    {
      enabled:
        baseUrlSlug === "escrow" && session?.user?.profileRole === "DESIGNER",
    },
  );

  const { data: designerProjects, isPending: loadingDesignerProjects } =
    useGetAllDesignerProject(
      {
        projectStatus: "LIVE",
      },
      {
        enabled: baseUrlSlug === "active-jobs",
      },
    );

  const escrowProjects =
    session?.user?.profileRole === "DESIGNER"
      ? escrowDesignerProjects
      : escrowBuyerProjects;

  const loadingEscrowProjects =
    session?.user?.profileRole === "DESIGNER"
      ? loadingEscrowDesignerProjects
      : loadingEscrowBuyerProjects;

  const projectsData = (
    baseUrlSlug === "projects"
      ? buyerProjects
      : baseUrlSlug === "escrow"
      ? escrowProjects
      : designerProjects
  )?.data?.data;

  const isPending =
    baseUrlSlug === "projects"
      ? loadingBuyerProjects
      : baseUrlSlug === "escrow"
      ? loadingEscrowProjects
      : loadingDesignerProjects;

  if (baseUrlSlug === "escrow" && pathName?.match(/^\/escrow\/paid-out$/))
    return null;

  if (!projectsData?.length) {
    return (
      <p className="h-[40vh] flex items-center justify-center text-gray-400">
        No active projects at the moment
      </p>
    );
  }

  return (
    <CustomCardHolder type="PROJECT" loading={isPending}>
      {projectsData?.map((project) => (
        <CustomCard
          key={project?.id}
          preTitle={project?.projectType === "PRIVATE"}
          color={
            uuidToBase62Safe(params?.id) === uuidToBase62Safe(project?.id)
              ? "primary"
              : undefined
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
