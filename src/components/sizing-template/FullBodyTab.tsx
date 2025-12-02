"use client";
import React from "react";
import { cn } from "@/lib/utils";

type FullBodyTabProps = {
  className?: string;
};

const FullBodyTab = ({ className }: FullBodyTabProps) => {
  return (
    <div
      className={cn(
        "text-sm font-semibold text-primary border-b-2 border-primary pb-2",
        className
      )}
    >
      Full-body
    </div>
  );
};

export default FullBodyTab;

