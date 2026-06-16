"use client";
import { ReviewRatingStars } from "@/components/custom/dialog/Review";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnProjectReview } from "@/types/project";
import { UmojaLinnCurrency } from "@/types/project";
import { formatDate } from "date-fns";
import React from "react";

type WorkHistoryItemProps = {
  review: UmojaLinnProjectReview;
};

const WorkHistoryItem = ({ review }: WorkHistoryItemProps) => {
  return (
    <div className="border border-input p-4 text-foreground-body">
      <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
        {review.project?.title || "Project"}
      </h3>
      <p className="mb-2">&quot;{review.message}&quot;</p>
      <p className="text-sm mb-2">
        {formatDate(review.createdAt, "MMM d, yyyy")} - Present
      </p>
      <ReviewRatingStars small rating={review.rating} disabled />
      <Separator className="bg-border/50 mb-2 mt-8" />
      <div className="flex justify-between text-sm gap-8">
        <p className="font-semibold">
          {getCurrencySymbol(review.project?.currency as UmojaLinnCurrency)}
          {formatCurrencyValue(review.project?.approvedBudget ?? 0)}
        </p>
        <span className="font-bold text-primary cursor-pointer">
          View details
        </span>
      </div>
    </div>
  );
};

export default WorkHistoryItem;
