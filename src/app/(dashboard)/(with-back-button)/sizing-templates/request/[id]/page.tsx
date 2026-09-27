"use client";
import { use } from "react";
import SizingTemplatePage from "@/components/sizing-template/SizingTemplatePage";
import TourReadyMarker from "@/components/tour/TourReadyMarker";
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

  const { data: bidData, isPending: isLoadingBid } = useGetBidById(bidId);
  const bid = bidData?.data?.data;
  const project = bid?.project;
  const sizingTemplateId = project?.sizingTemplateId;
  const isReady = !isLoadingBid && !!project;

  if (isLoadingBid) {
    return (
      <>
        <TourReadyMarker ready={false} />
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-[50vh] animate-pulse" />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <TourReadyMarker ready={false} />
        <div className="h-[50vh] flex items-center justify-center text-muted-foreground">
          <span>Project not found</span>
        </div>
      </>
    );
  }

  return (
    <>
      <TourReadyMarker ready={isReady} />
      <SizingTemplatePage
        id={sizingTemplateId ? uuidToBase62Safe(sizingTemplateId) : undefined}
        projectId={uuidToBase62Safe(project.id)}
        bidId={bidId}
        disableSaving={searchParams.disableSaving === "true"}
      />
    </>
  );
};

export default SizingTemplateRequestPage;
