"use client";
import CreateSizingTemplateDialog from "@/components/custom/dialog/CreateSizingTemplate";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import Image from "next/image";
import React from "react";

const SizingTemplatesPage = () => {
  const { data, isPending } = useGetAllSizingTemplates();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {new Array(4).fill("").map((_, index) => (
          <Skeleton className="h-52" key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CreateSizingTemplateDialog>
        <button className="relative h-52">
          <Image
            src="/img/webp/add-measurement.webp"
            alt=""
            className="absolute h-full w-full object-cover object-center"
            fill
          />
          <span className="absolute bottom-2 right-2 bg-primary-50 text-primary p-1 font-semibold rounded-full size-8 flex items-center justify-center">
            x{3 - (data?.data?.data?.length || 0)}
          </span>
        </button>
      </CreateSizingTemplateDialog>
      {data?.data?.data?.map?.((template) => {
        return (
          <button className="relative h-52" key={template?.id}>
            <Image
              src="/img/webp/sizing-template-card.webp"
              alt=""
              className="absolute object-center object-cover"
              fill
            />
            <div className="absolute bottom-0 p-4 backdrop-blur-md bg-white/30 border-t-1 border-white/50 w-full">
              <h2 className="text-subtitle-2 font-bold text-center truncate w-full">
                {template?.name}
              </h2>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SizingTemplatesPage;
