"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useGetDesignerProfile } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import DesignerProfileView from "@/section/dashboard/profile/DesignerProfileView";

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-32 rounded-sm" />
    <div className="flex gap-6  px-4 items-end">
      <Skeleton className="rounded-full w-40 h-40 shrink-0" />
      <div className="flex flex-col gap-2 flex-1 pb-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <Separator className="bg-border/50" />
    <div className="flex flex-col gap-2">
      {new Array(3).fill("").map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4">
      {new Array(6).fill("").map((_, i) => (
        <Skeleton key={i} className="h-10" />
      ))}
    </div>
  </div>
);

const DesignerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetDesignerProfile(id);
  const designer = data?.data?.data;

  if (isPending) return <LoadingSkeleton />;

  if (!designer)
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>Public designers not available yet</p>
      </div>
    );

  return <DesignerProfileView designer={designer} />;
};

export default DesignerProfilePage;
