"use client";
import MilestoneProgress from "@/components/custom/MilestoneProgress";
import { getCurrencySymbol } from "@/lib/string";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function formatCustomDate(date: Date): string {
  if (isToday(date)) return "hh:mmaaa";
  if (isYesterday(date)) return "'Yesterday'";
  return isThisYear(date) ? "dd MMM" : "dd MMM, yyyy";
}

const BidTabHistorySection = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetBidById(id);
  return (
    <div className="flex flex-col gap-4">
      {data?.data?.data?.history.map((bid) => (
        <Link
          key={bid.id}
          href={`/bids/${bid.id}`}
          className="card flex flex-col gap-4 hover:bg-gray-50 transition-colors"
        >
          <p>
            {format(
              new Date(bid?.createdAt),
              formatCustomDate(new Date(bid?.createdAt))
            )}
          </p>
          <MilestoneProgress total={bid?.milestones?.length || 0} value={0} />
          <div className="flex justify-between">
            <p className="text-gray-400">Total Payment</p>
            <p>
              {getCurrencySymbol(bid?.project?.currency)} {bid?.amount}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BidTabHistorySection;
