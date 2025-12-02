"use client";
import { Save } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type SuccessMessageProps = {
  className?: string;
};

const SuccessMessage = ({ className }: SuccessMessageProps) => {
  return (
    <div
      className={cn(
        "bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3",
        className
      )}
    >
      <div className="size-8 shrink-0 flex items-center justify-center bg-primary/10 rounded-full">
        <Save className="size-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground-body mb-1">
          Saved Measurement Points
        </p>
        <p className="text-sm text-muted-foreground">
          Your measurement point has been saved. Please return to submit it and
          continue the project.
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;

