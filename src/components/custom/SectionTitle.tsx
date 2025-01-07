import React, { ComponentProps } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SectionTitleProps = {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: ComponentProps<"button">["onClick"];
  size?: "small" | "medium" | "large";
  loading?: boolean;
};

type SectionTitleWrapperProps = Pick<SectionTitleProps, "onClick"> & {
  children: React.ReactNode;
  className: string;
};

const SectionTitleWrapper = (props: SectionTitleWrapperProps) => {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className={props.className}>
        {props.children}
      </button>
    );
  }
  return <div className={props.className}>{props.children}</div>;
};

const SectionTitle = (props: SectionTitleProps) => {
  const { size = "medium", action, title, onClick, loading } = props;
  return (
    <SectionTitleWrapper onClick={onClick} className="mb-4 block w-full">
      <div
        className={cn(
          "font-semibold text-foreground-body mb-3 w-full flex flex-row justify-between gap-4",
          size === "small" && "text-sm",
          size === "medium" && "text-md",
          size === "large" && "text-subtitle-2 font-bold"
        )}
      >
        <div className="flex flex-row gap-2">
          {props.icon && (
            <div className="flex-shrink-0 size-8 [&>svg]:size-5 bg-gray-100 flex items-center justify-center">
              {props.icon}
            </div>
          )}
          <span>{loading ? <Skeleton className="h-6 w-36" /> : title}</span>
        </div>
        {action}
      </div>
      <Separator className="bg-gray-200" />
    </SectionTitleWrapper>
  );
};

export default SectionTitle;
