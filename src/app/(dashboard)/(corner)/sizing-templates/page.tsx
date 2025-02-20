"use client";
import SizingTemplateCard from "@/components/custom/card/SizingTemplate";
import SizingTemplateDialog from "@/components/custom/dialog/SizingTemplate";
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
      <SizingTemplateDialog>
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
      </SizingTemplateDialog>
      {data?.data?.data?.map?.((template) => (
        <SizingTemplateCard template={template} key={template?.id} />
      ))}
    </div>
  );
};

export default SizingTemplatesPage;
