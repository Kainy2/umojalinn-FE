"use client";
import { ReviewRatingStars } from "@/components/custom/dialog/Review";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetUserReviews } from "@/tanstack/hooks/useProject";
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

  const projectReviews = userReviews?.data?.data ?? [];

  if (isPending)
    return (
      <div className="flex flex-col gap-8">
        {new Array(6).fill("").map((_, i) => (
          <Skeleton className="h-56" key={i} />
        ))}
      </div>
    );

  if (!projectReviews.length)
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>No reviews to show</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      {projectReviews.map((proj) => {
        const lastReview = proj.reviews[proj.reviews.length - 1];
        const avgRating =
          proj.reviews.length > 0
            ? proj.reviews.reduce((sum, r) => sum + r.rating, 0) / proj.reviews.length
            : 0;

        const href = proj.projectId
          ? `/completed-jobs/${uuidToBase62Safe(proj.projectId)}`
          : null;

        return (
          <div
            key={proj.projectId}
            className="border border-input p-4 text-foreground-body"
          >
            <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
              {proj.projectTitle}
            </h3>

            <div className="space-y-4">
              {proj.reviews.map((review) => (
                <div key={review.id}>
                  <h4 className="font-medium text-primary mb-1">
                    {review.reviewType === "EXPERIENCE"
                      ? "Experience feedback"
                      : "Clothing Quality feedback"}
                  </h4>
                  <p className="mb-2">&quot;{review.message}&quot;</p>
                </div>
              ))}
            </div>

            {lastReview && (
              <p className="text-sm mb-2 mt-4">
                {formatDate(lastReview.createdAt, "MMM d, yyyy")} - Present
              </p>
            )}

            <ReviewRatingStars small rating={Math.round(avgRating * 10) / 10} disabled />

            <Separator className="bg-border/50 mb-2 mt-8" />
            <div className="flex justify-between text-sm gap-8">
              <p className="font-semibold">
                {proj.approvedBudget ?? "-"}
              </p>
              {proj.counterparty ? (
                <p className="text-foreground-body">
                  <span className="font-semibold text-foreground">
                    {proj.counterparty.firstName} {proj.counterparty.lastName}
                  </span>
                </p>
              ) : null}
              {href ? (
                <Link href={href} className="font-bold text-primary">
                  View details
                </Link>
              ) : (
                <span className="font-bold text-muted cursor-not-allowed">
                  View details
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SettingsProfileWorkHistoryPage;
