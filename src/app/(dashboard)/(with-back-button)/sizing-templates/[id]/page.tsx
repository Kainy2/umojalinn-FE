"use client";
import { use } from "react";
import SizingTemplatePage from "@/components/sizing-template/SizingTemplatePage";
import TourReadyMarker from "@/components/tour/TourReadyMarker";
import { useGetSizingTemplateById } from "@/tanstack/hooks/useSizingTemplates";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SizingTemplateViewPage = (props: PageProps) => {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  const { data, isPending } = useGetSizingTemplateById(params.id);
  const isReady = !isPending && !!data?.data?.data;

  if (isPending) {
    return (
      <>
        <TourReadyMarker ready={false} />
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-[50vh] animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <TourReadyMarker ready={isReady} />
      <SizingTemplatePage
        id={params.id}
        disableSaving={searchParams.disableSaving === "true"}
      />
    </>
  );
};

export default SizingTemplateViewPage;
