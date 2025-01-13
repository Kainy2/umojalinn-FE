"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";

import Image from "next/image";
import React from "react";
import * as timeago from "timeago.js";

const CompletedCardList = () => {
  const { data, isPending } = useGetAllBuyerProject({
    projectStatus: "COMPLETED",
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton className="h-48 w-full" key={i} />
        ))}
      </div>
    );
  }

  if (!data?.data?.data?.length) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-muted-foreground">
        <span>No Projects conpleted</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {data?.data?.data?.map((project) => {
        const imgSrc = project?.Gallery?.find(
          (gallery) => gallery?.isCoverImage
        )?.imageUrl;
        return (
          <div key={project?.id} className="relative card flex gap-4 ">
            {" "}
            {imgSrc ? (
              <Image
                alt=""
                className="w-80 aspect-video shrink-0"
                src={imgSrc || "/img/svg/null.svg"}
              />
            ) : (
              <p className="w-80 aspect-video bg-gray-100 shrink-0 flex items-center justify-center text-foreground-body">
                No images
              </p>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="font-semibold text-subtitle-2">
                {project?.title}
              </h3>
              <p className="mb-4 text-sm">
                Created: {timeago?.format(project?.createdAt)}
              </p>

              <p className="flex-1 truncate">{project?.about}</p>
              <div className="flex flex-row items-center gap-4 w-full">
                <Image
                  width={100}
                  height={100}
                  src={
                    project?.designer?.user?.profilePhotoUri ||
                    "/img/webp/user.webp"
                  }
                  alt=""
                  className="rounded-full size-10 object-cover"
                />
                <p>
                  {project?.designer?.user?.firstName}{" "}
                  {project?.designer?.user?.lastName}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompletedCardList;
