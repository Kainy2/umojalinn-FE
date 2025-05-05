"use client";
import SizingTemplateCard from "@/components/custom/card/SizingTemplate";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import React from "react";

const SizingTemplatesPage = () => {
  const { data, isPending } = useGetAllSizingTemplates({
    sizingTemplateStatus: "IN_USE",
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {new Array(4).fill("").map((_, index) => (
          <Skeleton className="h-52" key={index} />
        ))}
      </div>
    );
  }

  if (!data?.data?.data?.length) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh] text-muted-foreground">
        <span>No templates in use</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.data?.data?.map?.((template) => (
        <SizingTemplateCard template={template} key={template?.id} />
      ))}
    </div>
  );
};

export default SizingTemplatesPage;
