import { Separator } from "@/components/ui/separator";
import { categorizeDate } from "@/lib/date";
import React from "react";

const ChatTimeDivider = (props: { date?: Date | string }) => {
  return (
    <div className="flex gap-2 items-center text-foreground-body text-sm">
      <Separator className="flex-1 bg-border/30" />
      <span>{categorizeDate(props.date || new Date())}</span>
      <Separator className="flex-1 bg-border/30" />
    </div>
  );
};

export default ChatTimeDivider;
