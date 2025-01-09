import React from "react";
import { CustomTabProps } from "@/components/custom/tab";
import { cn } from "@/lib/utils";

const TabButtonSelect = (props: CustomTabProps) => {
  return (
    <div className={cn("p-1 bg-gray-100 flex gap-1", props.className)}>
      {props?.tabs?.map?.((tab, index) => {
        const active = tab.value
          ? props.active === tab.value
          : props.active === tab.title;
        return (
          <button
            key={index}
            className={cn(
              "px-3 py-2 text-foreground-body shrink-0",
              active && "bg-background border border-primary text-primary"
            )}
            onClick={(e) => {
              props.onChange?.(tab.value);
              tab.onClick?.(e);
            }}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );
};

export default TabButtonSelect;
