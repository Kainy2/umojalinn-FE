import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Plus } from "lucide-react";
import { format } from "date-fns";

export type MilestoneTimelineItem = {
  id: string;
  title: string;
  description?: string;
  date: string;
  additionalContent?: React.ReactNode;
  isActive?: boolean; // Indicates if the item is active
  isCurrent?: boolean;
  pill?: {
    value: string;
    label?: string;
    color?: "SUCCESS" | "ERROR";
  };
  afterPill?: React.ReactNode;
  link?: {
    label: string;
    href: string;
  };
  actions?: ButtonProps[];
};

export type MilestoneTimelineProps = {
  items: MilestoneTimelineItem[];
  className?: string;
};

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  items,
  className,
}) => {
  return (
    <ol className={cn("flex flex-col gap-1.5", className)}>
      {items.map((item, index) => (
        <li key={index} className="flex flex-col gap-1.5">
          <div className="flex flex-row gap-3">
            {/* Circular indicator with icons */}
            <span
              className={cn(
                "relative h-8 w-8 shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 before:content-[''] before:h-5 before:absolute before:top-1/2 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2 before:w-5 before:border before:border-gray-200 before:rounded-full",
                item?.isActive &&
                  "bg-success-50 before:border-success text-success",
                item?.isCurrent &&
                  "bg-gray-50 before:border-gray-500 text-gray-500"
              )}
            >
              {item.isActive && <Check className="h-3 w-3" />}
              {item.isCurrent && <Plus className="h-3 w-3" />}
            </span>

            {/* Title */}
            <h3
              className={cn(
                "flex-1 font-semibold text-gray-400 mt-1 truncate",
                (item.isActive || item.isCurrent) && "text-foreground-body"
              )}
            >
              {item.title}
            </h3>
          </div>
          <div className="flex flex-row items-stretch gap-3">
            {/* Line indicator */}
            <span
              className={cn(
                "flex flex-col justify-center items-center w-8 shrink-0 before:content-[''] before:w-0.5 before:h-full before:bg-gray-200 before:flex-1 before:rounded-full ",
                item?.isActive && "before:bg-success",
                item?.isCurrent && "before:bg-gray-500"
              )}
            />
            {/* Details, actions and content */}
            <div className="flex-1 flex flex-col gap-2">
              <p
                className={cn(
                  "text-gray-400",
                  (item.isActive || item.isCurrent) && "text-foreground-body"
                )}
              >
                {item.description}
              </p>
              {item.additionalContent}
              <div
                className={cn(
                  "flex gap-2 flex-wrap items-center text-sm",
                  (item.isActive || item.isCurrent) && "text-foreground-body"
                )}
              >
                <time
                  className={cn(
                    "text-gray-400 text-sm",
                    (item.isActive || item.isCurrent) && "text-foreground-body"
                  )}
                >
                  {item.date &&
                    format(new Date(item.date), "MMM dd, yyyy • hh:mmaaa")}
                </time>
                {item.pill && (
                  <span
                    className={cn(
                      "flex items-center font-medium gap-2 p-0.5 rounded-full border border-gray-400 text-xs text-gray-400",
                      (item.isActive || item.isCurrent) &&
                        "border-gray-500 text-gray-500",
                      item.pill.color === "SUCCESS" &&
                        "border-success text-success",
                      item.pill.color === "ERROR" &&
                        "border-error-400 text-error-400"
                    )}
                  >
                    {item.pill.label && (
                      <span className="ml-2">{item.pill.label}</span>
                    )}
                    <span
                      className={cn(
                        "bg-gray-400 text-gray-50 px-1.5 py-0.5 rounded-full",
                        (item.isActive || item.isCurrent) && "bg-gray-500",
                        item.pill.color === "SUCCESS" &&
                          "bg-success text-success-50",
                        item.pill.color === "ERROR" &&
                          "bg-error-400 text-error-50"
                      )}
                    >
                      {item.pill?.value}
                    </span>
                  </span>
                )}
                {item.afterPill}
                {item.link && (
                  <Link
                    href={item.link.href}
                    className="text-sm underline text-primary"
                  >
                    {item.link?.label}
                  </Link>
                )}
              </div>
              {item?.actions && (
                <>
                  <Separator className="my-3" />
                  <div className="flex gap-4">
                    {item.actions?.map?.((btn, index) => (
                      <Button {...btn} key={index} fullWidth />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MilestoneTimeline;

/** Example Usage

import MilestoneTimeline from "./MilestoneTimeline";



*/
