import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export type CustomTabItemProps = {
  title: string;
  description?: string;
  href: string;
  count?: number;
  type?: CustomTabProps["type"];
  active?: boolean;
  hasPassed?: boolean;
};

type CustomTabProps = {
  tabs: CustomTabItemProps[];
  active: string;
  type?: "ONBOARD" | "NAVIGATOR";
};

const CustomTabItem = (props: CustomTabItemProps) => {
  if (props?.type === "NAVIGATOR") {
    return (
      <Link
        href={props.href}
        passHref
        className={`px-6 py-1.5 text-sm font-semibold border-b-2 transition-colors duration-200 leading-normal ${
          props.active
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-primary hover:border-primary"
        }`}
      >
        {props.title}
        {props.count !== undefined && (
          <span className="ml-2 px-3 py-1 text-xs font-bold text-foreground bg-gray-100 rounded-full">
            {props.count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={props.href}
      className={cn(
        "relative  pt-8 text-sm before:content-[''] before:absolute before:w-full before:h-3 md:before:h-1  before:rounded-full md:before:rounded-none before:top-0 before:bg-gray-100 w-20 md:flex-1",
        (props.active || props.hasPassed) && "before:bg-primary",
        props.active && "text-primary"
      )}
    >
      <span className="hidden md:block mb-5 font-semibold">{props.title}</span>
      <span className="hidden lg:block ">{props.description}</span>
    </Link>
  );
};

const CustomTab = (props: CustomTabProps) => {
  const { type = "ONBOARD", tabs } = props;
  if (type === "NAVIGATOR") {
    return (
      <div className="flex space-x-4 border-b border-border/50">
        {tabs?.map((tab, index) => (
          <CustomTabItem
            {...tab}
            type="NAVIGATOR"
            active={tab.title === props.active}
            key={index}
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
          />
        ))}
      </div>
    </div>
  );
};

export default CustomTab;
