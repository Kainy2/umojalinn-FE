import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export type CustomTabItemProps = {
  title: string;
  description?: string;
  href?: string;
  count?: number;
  type?: CustomTabProps["type"];
  active?: boolean;
  hasPassed?: boolean;
  match?: RegExp;
  replace?: CustomTabProps["replace"];
  onClick?: React.ComponentProps<"button">["onClick"];
  value?: unknown;
};

export type CustomTabProps = {
  tabs: CustomTabItemProps[];
  active: string | null;
  type?: "ONBOARD" | "NAVIGATOR";
  className?: string;
  replace?: boolean;
  onChange?: (value: unknown) => void;
};

const CustomTabItemWrapper = (
  props: CustomTabItemProps & {
    children: React.ReactNode;
  }
) => {
  let className = cn(
    "relative  pt-4 text-sm before:content-[''] before:absolute before:w-full before:h-3 md:before:h-1  before:rounded-full md:before:rounded-none before:top-0 before:bg-gray-100 w-20 md:flex-1 md:shrink-0 text-foreground-body",
    (props.active || props.hasPassed) && "before:bg-primary",
    props.active && "text-primary"
  );
  if (props?.type === "NAVIGATOR") {
    className = `px-6 py-3 text-sm font-semibold border-b-2 transition-colors duration-200 leading-normal ${
      props.active
        ? "border-primary text-primary"
        : "border-transparent text-gray-500 hover:text-primary"
    }`;
  }

  if (props.href) {
    return (
      <Link
        replace={props.replace}
        href={props.href || ""}
        passHref
        className={className}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button onClick={props.onClick} className={className}>
      {props.children}
    </button>
  );
};

const CustomTabItem = (props: CustomTabItemProps) => {
  if (props?.type === "NAVIGATOR") {
    return (
      <CustomTabItemWrapper {...props}>
        {props.title}
        {props.count !== undefined && (
          <span
            className={cn(
              "ml-2 px-3 py-1 text-xs font-bold  rounded-full",
              props.active ? "bg-primary-100" : "text-foreground bg-gray-100"
            )}
          >
            {props.count}
          </span>
        )}
      </CustomTabItemWrapper>
    );
  }

  return (
    <CustomTabItemWrapper {...props}>
      <span className="hidden md:block mb-5 font-semibold ">{props.title}</span>
      <span className="hidden lg:block ">{props.description}</span>
    </CustomTabItemWrapper>
  );
};

const CustomTab = (props: CustomTabProps) => {
  const { type = "ONBOARD", tabs } = props;
  if (type === "NAVIGATOR") {
    return (
      <div
        className={cn(
          "flex space-x-4 border-b border-border/50",
          props.className
        )}
      >
        {tabs?.map((tab, index) => (
          <CustomTabItem
            {...tab}
            type="NAVIGATOR"
            active={tab.title === props.active}
            key={index}
            replace={props.replace}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="text-center md:hidden mb-8">{props.active}</p>
      <div className="flex flex-row gap-4">
        {tabs?.map((tab, index) => (
          <CustomTabItem
            {...tab}
            key={tab.title}
            active={tab.title === props.active}
            hasPassed={
              index < props.tabs?.findIndex((t) => t?.title === props.active)
            }
            replace={props.replace}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomTab;
