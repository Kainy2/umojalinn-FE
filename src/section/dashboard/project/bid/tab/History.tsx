"use client";
import MilestoneProgress from "@/components/custom/milestone/Progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrencySymbol } from "@/lib/string";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { format, isThisYear, isToday, isYesterday } from "date-fns";

import { useParams } from "next/navigation";
import React from "react";

function formatCustomDate(date: Date): string {
  if (isToday(date)) return "hh:mmaaa";
  if (isYesterday(date)) return "'Yesterday'";
  return isThisYear(date) ? "dd MMM" : "dd MMM, yyyy";
}

const BidTabHistorySection = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetBidById(id);

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (!data?.data?.data?.history?.length) {
    return (
      <p className="h-40 flex items-center justify-center text-gray-400">
        No bid history
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {data?.data?.data?.history.map((bid) => (
        <div key={bid?.id} className="card flex flex-col gap-4 ">
          <p>
            {format(
              new Date(bid?.createdAt),
              formatCustomDate(new Date(bid?.createdAt))
            )}
          </p>
          <MilestoneProgress total={bid?.numberOfMileStones || 0} value={0} />
          <div className="flex justify-between">
            <p className="text-gray-400">Total Payment</p>
            <p>
              {getCurrencySymbol(data?.data?.data?.project?.currency)}{" "}
              {bid?.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidTabHistorySection;
