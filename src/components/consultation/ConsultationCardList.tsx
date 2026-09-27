"use client";
import { cn } from "@/lib/utils";
import {
  useGetBuyerConsultations,
  useGetDesignerConsultations,
} from "@/tanstack/hooks/useConsultation";
import {
  ConsultationBuyerFilter,
  ConsultationDesignerFilter,
  UmojaLinnConsultation,
} from "@/types/consultation";
import { UmojaLinnUserRole } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import ConsultationCard from "./ConsultationCard";

// ─── Filter config ────────────────────────────────────────────────────────────

const BUYER_FILTERS: { label: string; value: ConsultationBuyerFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Matching", value: "MATCHING" },
  { label: "Matched", value: "MATCHED" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Booked", value: "BOOKED" },
  { label: "Live", value: "LIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const DESIGNER_FILTERS: { label: string; value: ConsultationDesignerFilter }[] =
  [
    { label: "All", value: "ALL" },
    { label: "Assigned", value: "ASSIGNED" },
    { label: "Requested", value: "REQUESTED" },
    { label: "Booked", value: "BOOKED" },
    { label: "Live", value: "LIVE" },
    { label: "Add Summary", value: "ADD_SUMMARY" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

// ─── Buyer list ───────────────────────────────────────────────────────────────

const BuyerConsultationCardList = ({
  baseHref,
}: {
  baseHref: string;
}) => {
  const [filter, setFilter] = useState<ConsultationBuyerFilter>("ALL");

  const { data, isPending } = useGetBuyerConsultations(filter);
  const consultations: UmojaLinnConsultation[] = data?.data?.data ?? [];

  const getCount = (f: ConsultationBuyerFilter) => {
    if (!data?.data?.data) return 0;
    if (f === "ALL") return data.data.data.length;
    return data.data.data.filter((c) => c.buyerStatus === f).length;
  };

  return (
    <div className="flex gap-0 h-full">
      {/* Sidebar */}
      <div className="w-28 shrink-0 border-r pr-2 flex flex-col gap-0.5">
        {BUYER_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex items-center justify-between text-sm px-2 py-1.5 rounded text-left transition-colors",
              filter === f.value
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground-body hover:bg-gray-100",
            )}
          >
            <span>{f.label}</span>
            <span className="text-xs">{getCount(f.value)}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-w-0 pl-4 flex flex-col gap-3 overflow-y-auto">
        {isPending ? (
          <>
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </>
        ) : consultations.length === 0 ? (
          <p className="text-sm text-foreground-body text-center py-12">
            No {filter === "ALL" ? "" : filter.toLowerCase()} consultations yet.
          </p>
        ) : (
          consultations.map((c) => (
            <ConsultationCard
              key={c.id}
              consultation={c}
              role="BUYER"
              baseHref={baseHref}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ─── Designer list ────────────────────────────────────────────────────────────

const DesignerConsultationCardList = ({
  baseHref,
}: {
  baseHref: string;
}) => {
  const [filter, setFilter] = useState<ConsultationDesignerFilter>("ALL");

  const { data, isPending } = useGetDesignerConsultations(filter);
  const consultations: UmojaLinnConsultation[] = data?.data?.data ?? [];

  const getCount = (f: ConsultationDesignerFilter) => {
    if (!data?.data?.data) return 0;
    if (f === "ALL") return data.data.data.length;
    if (f === "ADD_SUMMARY")
      return data.data.data.filter(
        (c) => c.designerStatus === "AWAITING_SUMMARY",
      ).length;
    return data.data.data.filter((c) => c.designerStatus === f).length;
  };

  return (
    <div className="flex gap-0 h-full">
      {/* Sidebar */}
      <div className="w-32 shrink-0 border-r pr-2 flex flex-col gap-0.5">
        {DESIGNER_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex items-center justify-between text-sm px-2 py-1.5 rounded text-left transition-colors",
              filter === f.value
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground-body hover:bg-gray-100",
            )}
          >
            <span>{f.label}</span>
            <span className="text-xs">{getCount(f.value)}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-w-0 pl-4 flex flex-col gap-3 overflow-y-auto">
        {isPending ? (
          <>
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </>
        ) : consultations.length === 0 ? (
          <p className="text-sm text-foreground-body text-center py-12">
            No{" "}
            {filter === "ALL" ? "" : filter.replace("_", " ").toLowerCase()}{" "}
            consultations yet.
          </p>
        ) : (
          consultations.map((c) => (
            <ConsultationCard
              key={c.id}
              consultation={c}
              role="DESIGNER"
              baseHref={baseHref}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ─── Unified export ───────────────────────────────────────────────────────────

type ConsultationCardListProps = {
  role: UmojaLinnUserRole;
  baseHref: string;
};

const ConsultationCardList = ({ role, baseHref }: ConsultationCardListProps) => {
  if (role === "DESIGNER") {
    return <DesignerConsultationCardList baseHref={baseHref} />;
  }
  return <BuyerConsultationCardList baseHref={baseHref} />;
};

export default ConsultationCardList;
