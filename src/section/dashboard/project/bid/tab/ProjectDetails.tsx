"use client";
import LabelValue from "@/components/custom/LabelValue";

import { useGetProjectById } from "@/tanstack/hooks/useProject";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { BidTabProps } from ".";
import { format } from "date-fns";
import { getCurrencySymbol } from "@/lib/string";
import { EyeOff } from "lucide-react";
import { useGetBidById } from "@/tanstack/hooks/useBid";

const BidTabProjectDetailsSection = (props: BidTabProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData } = useGetBidById(id);
  const bid = bidData?.data?.data;
  const { data } = useGetProjectById(id);
  const project = props?.page === "create" ? data?.data?.data : bid?.project;

  return (
    <div className="flex flex-col gap-8">
      {props?.page === "create" && (
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
      )}
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
            <Image
              key={gallery?.id}
              src={gallery?.imageUrl}
              alt=""
              height={500}
              width={500}
              className="w-full aspect-square object-cover"
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
