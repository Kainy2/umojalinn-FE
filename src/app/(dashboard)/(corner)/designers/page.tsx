"use client";
import { Badge } from "@/components/ui/badge";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
import { Search, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type DiscoverTab = "discover" | "my-hires" | "favorites";

const MOCK_FILTERS = [
  { id: "country", label: "Nigeria" },
  { id: "experience", label: "3-5 Years" },
  { id: "min-rate", label: "$30" },
  { id: "max-rate", label: "$60" },
  { id: "language", label: "Mandarin Chinese" },
  { id: "fluency", label: "Fluent" },
];

const DiscoverDesignersPage = () => {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("my-hires");
  const [filters, setFilters] = useState(MOCK_FILTERS);

  const removeFilter = (id: string) =>
    setFilters((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="flex flex-col gap-0">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded mb-6 bg-gray-100 flex items-center justify-between min-h-[160px]">
        <div className="px-6 py-8 z-10">
          <h1 className="text-lg font-bold text-foreground mb-1">
            Browse Designers
          </h1>
          <p className="text-foreground-body text-sm">
            Work with your favourite designer to bring your style to life
          </p>
        </div>
        <div className="relative h-40 w-0/3 shrink-0 hidden sm:block">
          <Image
            src="/img/png/designer-cover.png"
            alt="Designers"
            fill
            className="object-cover object-left"
          />
        </div>
      </div>

      {/* Tabs */}
      <TabButtonSelect
        type="DEFAULT"
        active={activeTab}
        onChange={(val) => setActiveTab(val as DiscoverTab)}
        tabs={[
          // { title: "Discover", value: "discover" },
          { title: "My Hires", value: "my-hires" },
          { title: "Favorites", value: "favorites" },
        ]}
      />

      {/* Filter chips */}
      {activeTab === "discover" && filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap my-4">
          <span className="text-sm text-foreground-body whitespace-nowrap">
            {filters.length > 0 ? "56 Results for" : ""}
          </span>
          {filters.map((f) => (
            <Badge
              key={f.id}
              variant="outline"
              className="cursor-pointer gap-1 pr-1"
              onClick={() => removeFilter(f.id)}
            >
              {f.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-72 text-muted-foreground gap-3">
        <Search className="h-12 w-12 text-muted-foreground/40" />
        <p>No Result found</p>
      </div>
    </div>
  );
};

export default DiscoverDesignersPage;
