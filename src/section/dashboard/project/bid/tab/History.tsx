"use client";
import MilestoneProgress from "@/components/custom/MilestoneProgress";
import { MOCK_BIDS } from "@/data/bid";
import { getCurrencySymbol } from "@/lib/string";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import Link from "next/link";
import React from "react";

function formatCustomDate(date: Date): string {
  if (isToday(date)) return "hh:mmaaa";
  if (isYesterday(date)) return "'Yesterday'";
  return isThisYear(date) ? "dd MMM" : "dd MMM, yyyy";
}

const BidTabHistorySection = () => {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_BIDS.map((bid) => (
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
              {getCurrencySymbol(bid?.currency)} {bid?.budget}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BidTabHistorySection;
