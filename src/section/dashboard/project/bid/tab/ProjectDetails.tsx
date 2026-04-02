"use client";
/**
 * BidTabProjectDetailsSection - Displays project details in bid sidebar.
 * Uses the reusable SizingTemplatePill component for sizing template states.
 */

import LabelValue from "@/components/custom/LabelValue";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import { getCurrencySymbol } from "@/lib/string";
import { EyeOff } from "lucide-react";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { Skeleton } from "@/components/ui/skeleton";
import GalleryImages from "@/components/custom/GalleryImages";
import { formatCurrencyValue } from "@/lib/number";
import { cn } from "@/lib/utils";
import { SizingTemplatePill } from "@/components/sizing-template";

const BidTabProjectDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData, isPending } = useGetBidById(id);
  const bid = bidData?.data?.data;
  const project = bid?.project;

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-20" />
        <div className="flex flex-col gap-3">
          {new Array(2).fill("").map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
          <Skeleton className="h-4 w-3/4" />
        </div>
        {new Array(4).fill("").map((_, i) => (
          <div className="" key={i}>
            <Skeleton className="h-3 mb-2 w-32 " />
            <Skeleton className="h-5 w-52 " />
          </div>
        ))}
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-2 w-40 mb-4" />
          <Skeleton className="aspect-square max-w-64" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <p className="h-40 flex items-center justify-center text-gray-400">
        No project to display
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative bg-stone-100 border-l-4 border-stone-600 p-4">
        {project.projectType === "PRIVATE" && (
          <span className="absolute rounded-full p-2 [&>svg]:size-5 text-primary bg-background top-2 right-2">
            <EyeOff />
          </span>
        )}
        <p className="text-sm">Project Budget</p>
        <p className="text-lg font-semibold truncate">
          {getCurrencySymbol(project?.currency)}
          {formatCurrencyValue(project?.budget)}
        </p>
      </div>
      <p className="mb-2 break-words">{project?.about}</p>
      <LabelValue
        label="Delivery location"
        value={[
          project?.deliveryAddress?.state || "",
          project?.deliveryAddress?.country || "",
        ]}
      />
      <LabelValue
        label="Project deadline"
        value={
          project?.dueDate ? format(project?.dueDate, "dd MMM, yyyy") : "None"
        }
      />

      <div className="items-center gap-2">
        <p className="text-foreground-body text-sm mb-2">
          Will buyer provide materials?
        </p>
        <div
          className={cn(
            "mb-2 font-semibold text-subtitle-2",
            bid.project.willProvideMaterials ? "text-green-500" : "text-red-600"
          )}
        >
          {bid.project.willProvideMaterials ? "Yes" : "No"}
        </div>
      </div>

      <LabelValue
        label="Clothing types"
        value={project?.clothingTypes?.map((type) => type?.name) || "None"}
      />
      <LabelValue
        label="Additional note"
        value={project?.additionalNotes || "None"}
      />

      {/* Sizing Template Pill */}
      <span>
        <SizingTemplatePill projectId={project.id} bidId={bid.id} />
      </span>

      <div>
        <h3 className="mb-2 font-semibold text-subtitle-2">
          Styling Inspirations
        </h3>
        <p className="text-sm mb-4 text-foreground-body">
          Snapshots of your work
        </p>
        {project?.Gallery ? (
          <GalleryImages
            height={100}
            width={100}
            images={project.Gallery}
            wrapperClassName="aspect-square w-full h-auto"
          />
        ) : (
          <Image
            src="/img/svg/null.svg"
            alt=""
            height={500}
            width={500}
            className="w-full col-span-2 aspect-square object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default BidTabProjectDetailsSection;
