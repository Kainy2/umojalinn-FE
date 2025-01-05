"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as timeago from "timeago.js";

const DraftCardList = () => {
  const { data, isPending } = useGetAllBuyerProject({
    projectStatus: "DRAFT",
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

  return (
    <div className="flex flex-col gap-8">
      {data?.data?.data?.map((project) => {
        const imgSrc = project?.Gallery?.find(
          (gallery) => gallery?.isCoverImage
        )?.imageUrl;
        return (
          <Link
            key={project?.id}
            href={`/project/${uuidToBase62Safe(project?.id)}`}
            className="relative card flex gap-4 hover:bg-gray-50 transition-colors"
          >
            <Trash2 className="size-5 absolute top-4 right-4" />
            {imgSrc ? (
              <Image
                alt=""
                className="w-80 aspect-video shrink-0"
                src={imgSrc}
                width={200}
                height={200}
              />
            ) : (
              <p className="w-80 object-cover aspect-video bg-gray-100 shrink-0 flex items-center justify-center text-foreground-body">
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
                <div className="block w-full flex-1 bg-gray-100 h-3 rounded-full">
                  <div
                    className={`bg-primary h-full rounded-full`}
                    style={{
                      width: `${50}%`,
                    }}
                  />
                </div>
                <p>50%</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DraftCardList;
