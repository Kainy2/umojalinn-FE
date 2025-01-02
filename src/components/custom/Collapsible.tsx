import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionTitle from "./SectionTitle";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

const Collapsible = (props: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <SectionTitle
        title={props.title}
        onClick={() => setCollapsed((prev) => !prev)}
        action={
          collapsed ? (
            <ChevronUp className="text-primary h-6 w-6" />
          ) : (
            <ChevronDown className="text-primary h-6 w-6" />
          )
        }
      />
      <div className={cn("flex flex-col gap-8 px-2", collapsed && "hidden")}>
        {props.children}
      </div>
    </div>
  );
};

export default Collapsible;
