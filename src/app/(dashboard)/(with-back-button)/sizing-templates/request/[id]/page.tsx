"use client";
import { use } from "react";
import SizingTemplatePage from "@/components/sizing-template/SizingTemplatePage";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { uuidToBase62Safe } from "@/lib/uuid";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SizingTemplateRequestPage = (props: PageProps) => {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  const bidId = params.id;

  // Fetch bid data to get project and template info
  const { data: bidData, isPending: isLoadingBid } = useGetBidById(bidId);
  const bid = bidData?.data?.data;
  const project = bid?.project;
  const sizingTemplateId = project?.sizingTemplateId;

  if (isLoadingBid) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-[50vh] animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-muted-foreground">
        <span>Project not found</span>
      </div>
    );
  }

  return (
    <SizingTemplatePage
      id={sizingTemplateId ? uuidToBase62Safe(sizingTemplateId) : undefined}
      projectId={uuidToBase62Safe(project.id)}
      bidId={bidId}
      disableSaving={searchParams.disableSaving === "true"}
    />
  );
};

export default SizingTemplateRequestPage;

