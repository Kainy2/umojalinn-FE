"use client";
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
        <span className="absolute rounded-full p-2 [&>svg]:size-5 text-primary bg-background top-2 right-2">
          <EyeOff />
        </span>
        <p className="text-sm">Project Budget</p>
        <p className="text-lg font-semibold truncate">
          {getCurrencySymbol(project?.currency)}
          {project?.budget}
        </p>
      </div>
      <p className="mb-2">{project?.about}</p>
      <LabelValue
        label="Delivery location"
        value={[
          project?.deliveryAddress?.state || "",
          project?.deliveryAddress?.country || "",
        ]}
      />
      {/* <LabelValue label="Language" value={[["English", "Basic"]]} /> */}
      {/* <LabelValue label="Total jobs" value={"16 Jobs"} /> */}
      <LabelValue
        label="Project deadline"
        value={
          project?.dueDate ? format(project?.dueDate, "dd MMM, yyyy") : "None"
        }
      />
      {/* <LabelValue label="Yeas of Experience" value={"2 - 3 years"} /> */}
      <LabelValue
        label="Clothing types"
        value={project?.clothingTypes?.map((type) => type?.name) || "None"}
      />
      <LabelValue
        label="Aditional note"
        value={project?.additionalNotes || "None"}
      />
      <div>
        <h3 className="mb-2 font-semibold text-subtitle-2">
          Styling Inspirations
        </h3>
        <p className="text-sm mb-4 text-foreground-body">
          Snapshots of your work
        </p>
        <div className="grid grid-cols-2 gap-4">
          {project?.Gallery?.map?.((gallery) => (
            <GalleryImages
              title={gallery?.title}
              src={gallery?.imageUrl}
              height={500}
              width={500}
              wrapperClassName="aspect-square"
              key={gallery.id}
            />
          )) || (
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
    </div>
  );
};

export default BidTabProjectDetailsSection;
