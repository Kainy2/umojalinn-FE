import CheckCircle from "@/icons/CheckCircle";
import { cn } from "@/lib/utils";
import React from "react";
type DialogListPickerItemProps = {
  onClick: React.ComponentProps<"button">["onClick"];
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  rounded?: boolean;
  noIconWrapper?: boolean;
};

const DialogListPickerItem = (props: DialogListPickerItemProps) => {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        "flex flex-row items-center px-2 py-1 gap-2 border border-gray-100",
        props.active && "border-none ring-2 ring-primary bg-primary-25",
        props.rounded && "rounded"
      )}
    >
      <div
        className={cn(
          "size-14 flex items-center justify-center shrink-0",
          !props.noIconWrapper && "icon-wrapper primary"
        )}
      >
        {props.icon}
      </div>
      <div
        className={cn(
          "flex-1 text-left text-foreground-body",
          props.active && "text-primary"
        )}
      >
        <p className="font-semibold">{props.title}</p>
        {props.description && <p>{props.description}</p>}
      </div>
      {props.active ? (
        <CheckCircle className="size-6 text-primary shrink-0" />
      ) : (
        <span className="border border-gray-400 rounded-full size-6 shrink-0" />
      )}
    </button>
  );
};

export default DialogListPickerItem;
