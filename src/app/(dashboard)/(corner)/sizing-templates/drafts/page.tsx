"use client";
import SizingTemplateDialog from "@/components/custom/dialog/SizingTemplate";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import Image from "next/image";
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
    <div className="w-full h-[50vh] text-muted-foreground">
      <span>No data</span>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.data?.data?.map?.((template) => {
        const inUse = template?.status === "IN_USE";
        const projectInUse = inUse
          ? template?.projects?.find((temp) => temp.status !== "COMPLETED")
          : undefined;
        return (
          <SizingTemplateDialog key={template?.id} id={template?.id}>
            <button className="relative h-52">
              <Image
                src="/img/webp/sizing-template-card.webp"
                alt=""
                className="absolute object-center object-cover"
                fill
              />
              <div
                className={cn(
                  "absolute bottom-0 p-4 backdrop-blur-md bg-white/30 border-t-1 border-white/50 w-full",
                  inUse && "h-full border-none"
                )}
              >
                <h2 className="text-subtitle-2 font-bold text-center truncate w-full">
                  {template?.name}
                </h2>
                {inUse && <p className="text-primary font-semibold">In use</p>}
              </div>
              {!!projectInUse && (
                <span className="absolute top-2 left-2 px-4 py-2 bg-primary text-white">
                  {projectInUse?.title}
                </span>
              )}
            </button>
          </SizingTemplateDialog>
        );
      })}
    </div>
  );
};

export default SizingTemplatesPage;
