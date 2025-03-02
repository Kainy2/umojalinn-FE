"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserReviews } from "@/tanstack/hooks/useProject";
import { useSession } from "next-auth/react";
import React from "react";

const SettingsProfileWorkHistoryPage = () => {
  const { data: session } = useSession();
  const { data: userReviews, isPending } = useGetUserReviews(
    {
      profileType: session?.user?.profileRole || "BUYER",
    },
    {
      enabled: !!session?.user?.profileRole,
    }
  );

  if (isPending)
    return (
      <div className="flex flex-col gap-8">
        {new Array(6).fill("").map((_, i) => (
          <Skeleton className="h-56" key={_ + i} />
        ))}
      </div>
    );

  if (!userReviews?.data?.data?.length)
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>No reviews</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      {userReviews?.data?.data?.map((review) => (
        <div key={review?.id}></div>
      ))}
    </div>
  );
};

export default SettingsProfileWorkHistoryPage;
