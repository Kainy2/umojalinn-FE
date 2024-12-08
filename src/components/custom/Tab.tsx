import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type CustomTabItemProps = {
  title: string;
  description: string;
  href: string;
  active?: boolean;
  hasPassed?: boolean;
};

type CustomTabProps = {
  tabs: CustomTabItemProps[];
  active: string;
};

const CustomTabItem = (props: CustomTabItemProps) => {
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
  return (
    <div>
      <p className="text-center md:hidden mb-8">{props.active}</p>
      <div className="flex flex-row gap-4">
        {props.tabs?.map((item, index) => (
          <CustomTabItem
            {...item}
            key={item.title}
            active={item.title === props.active}
            hasPassed={
              index <
              props.tabs?.findIndex((tab) => tab?.title === props.active)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CustomTab;
