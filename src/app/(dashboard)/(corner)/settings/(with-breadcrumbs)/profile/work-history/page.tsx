"use client";
import { ReviewRatingStars } from "@/components/custom/dialog/Review";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetUserReviews } from "@/tanstack/hooks/useProject";
import { UmojaLinnProject } from "@/types/project";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SettingsProfileWorkHistoryPage = () => {
  const { data: session } = useSession();
  const { data: userReviews, isPending } = useGetUserReviews(
    {
      profileType: session?.user?.profileRole || "BUYER",
    },
    {
      enabled: !!session?.user?.profileRole,
    },
  );

  const getProjectHref = (id?: string, status?: UmojaLinnProject["status"]) => {
    if (!id || !status) return null;
    const baseHref = status === "COMPLETED" ? "completed-jobs" : "active-jobs";
    return `/${baseHref}/${uuidToBase62Safe(id)}`;
  };

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
      {userReviews?.data?.data?.map((review) => {
        const href = getProjectHref(
          review?.project?.id,
          review?.project?.status,
        );
        return (
          <div
            key={review?.id}
            className="border border-input p-4 text-foreground-body"
          >
            <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
              {review?.project?.title}
            </h3>

            <h4 className="font-medium mb-1">
              {review?.reviewType === "EXPERIENCE"
                ? "Experience"
                : "Clothing Quality"}{" "}
              feedback
            </h4>
            <p className="mb-2">&quot;{review?.message}&quot;</p>

            <p className="text-sm mb-4">
              {formatDate(review?.createdAt, "MMM d, yyyy")} - Present
            </p>
            <ReviewRatingStars small rating={review?.rating} disabled />
            <Separator className="bg-border/50  my-2" />
            <div className="flex  justify-between text-sm gap-8">
              <p className="font-semibold">
                {getCurrencySymbol(review?.project?.currency)}
                {formatCurrencyValue(review?.project?.approvedBudget)}
              </p>
              {session?.user?.profileRole === "DESIGNER" ? (
                <p className="text-foreground-body">
                  Designer{" "}
                  <span className="font-semibold text-foreground">
                    {review?.project?.designer?.user?.firstName}{" "}
                    {review?.project?.designer?.user?.lastName}
                  </span>
                </p>
              ) : (
                <Link
                  href={href || "#"}
                  className={cn(
                    "font-bold text-primary",
                    !href && "text-muted cursor-not-allowed",
                  )}
                >
                  View details
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SettingsProfileWorkHistoryPage;
