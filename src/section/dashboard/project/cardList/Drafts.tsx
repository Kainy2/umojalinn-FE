"use client";
import VerifyDialog from "@/components/custom/dialog/Verify";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useDeleteProject,
  useGetAllBuyerProject,
} from "@/tanstack/hooks/useProject";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as timeago from "timeago.js";

const DraftCardList = () => {
  const [verifyDelete, setVerifyDelete] = useState<boolean>(false);
  const { data, isPending } = useGetAllBuyerProject({
    projectStatus: "DRAFT",
  });
  const router = useRouter();

  const { mutate: deleteProjectById } = useDeleteProject();

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
        <span>No Drafts available</span>
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
          <button
            key={project?.id}
            onClick={() =>
              router.push(`/project/${uuidToBase62Safe(project?.id)}`)
            }
            className="relative text-left card flex flex-col lg:flex-row gap-4 hover:bg-gray-50 transition-colors"
          >
            <VerifyDialog
              onOpenChange={setVerifyDelete}
              open={verifyDelete}
              title="Delete Draft Project"
              description="Are you sure you want to delete your project? This action cannot be undone"
              destructive
              confirmText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteProjectById(project?.id);
                setVerifyDelete(false);
              }}
            >
              <button
                className="absolute top-4 right-4 [&>svg]:size-5 p-2 "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVerifyDelete(true);
                }}
              >
                <Trash2 />
              </button>
            </VerifyDialog>
            {imgSrc ? (
              <Image
                alt=""
                className="w-80 object-cover aspect-video shrink-0"
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

              <p className="flex-1 line-clamp-3">{project?.about}</p>
              <div className="flex flex-row items-center gap-4 w-full">
                <div className="block w-full flex-1 bg-gray-100 h-3 rounded-full">
                  <div
                    className={`bg-primary h-full rounded-full`}
                    style={{
                      width: `${project?.percentageCompleted || 0}%`,
                    }}
                  />
                </div>
                <p>{project?.percentageCompleted || 0}%</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DraftCardList;
