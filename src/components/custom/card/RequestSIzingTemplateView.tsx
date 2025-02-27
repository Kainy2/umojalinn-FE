"use client";
import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";
import React, { useState } from "react";

type RequestSizingTemplateViewCardProps = {
  title: string;
  review: string;
  className?: string;
};

const RequestSizingTemplateViewCard = (
  props: RequestSizingTemplateViewCardProps
) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={cn(
        "flex gap-2 bg-white border border-gray-200 text-foreground-body text-sm rounded-lg p-3 w-full",
        props.className,
        !open &&
          "size-7 aspect-square flex items-center justify-center cursor-pointer p-0"
      )}
      onClick={() => setOpen(true)}
    >
      <span
        className={cn(
          "flex items-center justify-center size-7 shrink-0 border border-input/50 rounded-sm",
          !open && "border-transparent"
        )}
      >
        <Info className="shrink-0 size-5" />
      </span>
      {open && (
        <>
          <div className="flex-1">
            <p className="font-semibold">{props.title}</p>
            <p>{props.review}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <X className="size-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default RequestSizingTemplateViewCard;
