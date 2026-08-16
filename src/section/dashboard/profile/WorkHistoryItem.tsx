"use client";
import { AverageRatingStars } from "@/components/custom/dialog/Review";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { WorkHistoryEntry } from "@/types/project";
import { formatDate } from "date-fns";
import React, { useMemo } from "react";

type WorkHistoryItemProps = {
  entry: WorkHistoryEntry;
};

const WorkHistoryItem = ({ entry }: WorkHistoryItemProps) => {
  const lastReview = entry.reviews[entry.reviews.length - 1];
  const avgRating = useMemo(
    () =>
      entry.reviews.length > 0
        ? entry.reviews.reduce((sum, r) => sum + r.rating, 0) /
          entry.reviews.length
        : 0,
    [entry.reviews],
  );
   

  return (
    <div className="border border-input p-4 text-foreground-body">
      <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
        {entry.projectTitle}
      </h3>

      <div className="space-y-4">
        {entry.reviews.map((review) => (
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

      <AverageRatingStars
        small
        rating={Math.round(avgRating * 10) / 10}
        disabled
      />

      <Separator className="bg-border/50 mb-2 mt-8" />
      <div className="flex justify-between text-sm gap-8">
        <p className="font-semibold">
          {entry?.approvedBudget
            ? `${getCurrencySymbol(entry?.currency)}${formatCurrencyValue(entry?.approvedBudget)}`
            : "-"}
        </p>
        <span className="font-bold text-primary cursor-pointer">
          View details
        </span>
      </div>
    </div>
  );
};

export default WorkHistoryItem;
