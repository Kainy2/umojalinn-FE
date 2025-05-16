"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { categorizeDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useGetProjectMediaAndlinks } from "@/tanstack/hooks/useProject";
import { Image as ImageIcon, Link2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const ActiveProjectMediaAndLinksPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetProjectMediaAndlinks(id);

  const mediaAndLinks = data?.data?.data;

  if (isPending)
    return (
      <div className="flex flex-col text-foreground-body gap-4">
        {new Array(5).fill("").map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );

  if (!mediaAndLinks?.length)
    return (
      <div className="flex items-center justify-center h-[30vh] text-gray-500 text-sm">
        <p>No media data</p>
      </div>
    );

  return (
    <div className="flex flex-col text-foreground-body gap-4">
      {mediaAndLinks?.map((value, index) => (
        <div key={index}>
          {index === 0 ||
            (categorizeDate(value?.createdAt) !==
              categorizeDate(mediaAndLinks?.[index - 1]?.createdAt) && (
              <p className="font-semibold mb-2">
                {categorizeDate(value?.createdAt)}
              </p>
            ))}
          <a
            href={value?.url}
            download={value?.type === "media"}
            target="_blank"
            className={cn(
              "flex gap-2 items-center border border-border/20 bg-gray-50",
              value?.type === "media" && "bg-slate-50"
            )}
          >
            <span className="icon-wrapper warning">
              {value?.type === "media" && <ImageIcon />}
              {value?.type === "link" && <Link2 />}
            </span>
            <p>{value?.type === "media" ? value.meta.fileName : value.url}</p>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ActiveProjectMediaAndLinksPage;
