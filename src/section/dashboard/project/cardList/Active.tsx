"use client";
import CustomCard from "@/components/custom/card";
import CustomCardHolder from "@/components/custom/card/Holder";
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useGetInfiniteBuyerProjects,
  useGetInfiniteDesignerProjects,
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

  const isDesignerInfinite =
    baseUrlSlug === "active-jobs" ||
    (baseUrlSlug === "escrow" && session?.user?.profileRole === "DESIGNER");

  const isBuyerInfinite =
    baseUrlSlug === "projects" ||
    (baseUrlSlug === "escrow" && session?.user?.profileRole === "BUYER");

  const {
    data: infiniteBuyerProjects,
    isPending: loadingInfiniteBuyerProjects,
    isFetchingNextPage: isFetchingNextBuyerPage,
    fetchNextPage: fetchNextBuyerPage,
    hasNextPage: hasNextBuyerPage,
  } = useGetInfiniteBuyerProjects(
    {
      projectStatus: "LIVE",
    },
    {
      enabled: isBuyerInfinite,
    },
  );

  const {
    data: infiniteDesignerProjects,
    isPending: loadingInfiniteDesignerProjects,
    isFetchingNextPage: isFetchingNextDesignerPage,
    fetchNextPage: fetchNextDesignerPage,
    hasNextPage: hasNextDesignerPage,
  } = useGetInfiniteDesignerProjects(
    {
      projectStatus: "LIVE",
    },
    {
      enabled: isDesignerInfinite,
    },
  );

  const buyerProjects = useInfiniteData(infiniteBuyerProjects);
  const designerProjects = useInfiniteData(infiniteDesignerProjects);

  const projectsData = isDesignerInfinite ? designerProjects : buyerProjects;

  const isPending = isDesignerInfinite
    ? loadingInfiniteDesignerProjects
    : loadingInfiniteBuyerProjects;

  const hasNextPage = isDesignerInfinite
    ? hasNextDesignerPage
    : hasNextBuyerPage;
  const isFetchingNextPage = isDesignerInfinite
    ? isFetchingNextDesignerPage
    : isFetchingNextBuyerPage;
  const fetchNextPage = isDesignerInfinite
    ? fetchNextDesignerPage
    : fetchNextBuyerPage;

  if (baseUrlSlug === "escrow" && pathName?.match(/^\/escrow\/paid-out$/))
    return null;

  if (!isPending && !projectsData?.length) {
    return (
      <p className="h-[40vh] flex items-center justify-center text-gray-400">
        No active projects at the moment
      </p>
    );
  }

  return (
    <CustomCardHolder type="PROJECT" loading={isPending}>
      {projectsData?.map((project, index) => (
        <CustomCard
          key={project?.id}
          id={
            baseUrlSlug === "projects" && index === 0
              ? "tour-active-project-card"
              : undefined
          }
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
      {(isDesignerInfinite || isBuyerInfinite) && hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="shrink-0 self-center text-primary text-sm px-4 py-2 hover:text-primary/70 transition disabled:opacity-50 whitespace-nowrap"
        >
          {isFetchingNextPage ? "Loading more..." : "See more"}
        </button>
      )}
    </CustomCardHolder>
  );
};

export default ActiveProjectCardList;
