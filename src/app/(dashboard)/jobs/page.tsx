"use client";
import AdCard from "@/components/custom/card/Ad";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";
import React from "react";

const JobsPage = () => {
  const {
    data: privateJobAdsWithoutBidProjectsData,
    isPending: isLoadingPrivateJobAdsWithoutBidProjectsData,
  } = useGetAllDesignerProject({
    projectStatus: "ADS",
    projectType: "PRIVATE",
    hasBid: false,
  });

  if (isLoadingPrivateJobAdsWithoutBidProjectsData) {
    return (
      <div className="flex flex-col gap-4">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton className="h-32" key={i} />
        ))}
      </div>
    );
  }

  if (!privateJobAdsWithoutBidProjectsData?.data?.data?.length) {
    return (
      <div className="h-[40vh] flex items-center justify-center text-muted-foreground">
        <span>No Job Ads available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {privateJobAdsWithoutBidProjectsData?.data?.data?.map?.((ad) => (
        <AdCard project={ad} key={ad?.id} />
      ))}
    </div>
  );
};

export default JobsPage;
