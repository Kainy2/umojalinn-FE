"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IMilestoneMultiSelectProps } from "./@types";

export const MilestoneMultiSelect = ({
  milestones,
  value,
  onChange,
  placeholder = "Select milestone(s) to refund",
}: IMilestoneMultiSelectProps) => {
  const selectedLabels = milestones
    .filter((milestone) => value.includes(milestone.id))
    .map((milestone) => milestone.title);

  const displayValue =
    selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder;

  const toggleMilestone = (milestoneId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, milestoneId]);
      return;
    }
    onChange(value.filter((id) => id !== milestoneId));
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label className="font-semibold text-foreground-body">
        Related Milestone(s)
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-12 w-full items-center justify-between rounded-none border border-input bg-background px-3 py-2 text-left text-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              !selectedLabels.length && "text-muted-foreground",
            )}
          >
            <span className="line-clamp-1 pr-2">{displayValue}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2"
          align="start"
        >
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {milestones.map((milestone) => {
              const checked = value.includes(milestone.id);
              return (
                <label
                  key={milestone.id}
                  htmlFor={`refund-milestone-${milestone.id}`}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                >
                  <Checkbox
                    id={`refund-milestone-${milestone.id}`}
                    checked={checked}
                    onCheckedChange={(next) =>
                      toggleMilestone(milestone.id, !!next)
                    }
                  />
                  <span className="truncate">{milestone.title}</span>
                </label>
              );
            })}
            {!milestones.length && (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                No milestones available
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MilestoneMultiSelect;
