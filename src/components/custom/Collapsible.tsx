import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

const Collapsible = (props: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4"
      >
        <span>{props.title}</span>{" "}
        {collapsed ? (
          <ChevronUp className="text-primary h-6 w-6" />
        ) : (
          <ChevronDown className="text-primary h-6 w-6" />
        )}
      </button>
      <Separator className="bg-slate-200 mb-4" />
      <div className={cn("flex flex-col gap-8 px-2", collapsed && "hidden")}>
        {props.children}
      </div>
    </div>
  );
};

export default Collapsible;
