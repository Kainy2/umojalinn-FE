"use client";
import React, { useMemo } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type GenericCustomSidebarMenuItemProps = {
  title: string;
  regex?: RegExp;
};

type AdCustomSidebarMenuItemProps = GenericCustomSidebarMenuItemProps & {
  isAd: true;
  img: string;
  action: {
    title: string;
    href: string;
  };
  description: string;
};

type NonAdCustomSidebarMenuItemProps = GenericCustomSidebarMenuItemProps & {
  isAd?: false;
  url: string;
  icon: React.ReactElement;
};

export type CustomSidebarMenuItemProps =
  | AdCustomSidebarMenuItemProps
  | NonAdCustomSidebarMenuItemProps;

const CustomSidebarMenuItem = (props: CustomSidebarMenuItemProps) => {
  const pathName = usePathname();
  const active = !!props.regex?.test?.(pathName);

  const badge = useMemo(() => {
    switch (props?.title?.toLocaleUpperCase?.()) {
      // case "DASHBOARD":
      //   return 10;
      default:
        return 0;
    }
  }, [props?.title]);

  if (props.isAd) {
    return (
      <div key={props.title} className="bg-gray-50 px-2 py-6 my-2 block">
        <h4 className="font-semibold leading-normal">{props.title}</h4>
        <p className="leading-normal mb-4">{props.description}</p>
        <Image
          alt={props.title}
          src={props.img}
          height={172.72}
          width={216}
          className="h-32 w-full object-cover rounded-md mb-6"
        />
        <Link className="font-semibold text-primary" href={props.action?.href}>
          {props.action?.title}
        </Link>
      </div>
    );
  }

  return (
    <SidebarMenuItem key={props.title}>
      <SidebarMenuButton
        asChild
        className={cn(
          "rounded-none p-3 h-10",
          active &&
            "bg-primary text-white hover:text-white active:text-white  hover:bg-primary-600 active:bg-primary-700 "
        )}
      >
        <a href={props.url}>
          {props.icon}
          <span className="flex-1 h-5 flex items-center">{props.title}</span>
          {!!badge && (
            <span
              className={cn(
                "shrink-0 h-5  w-5 text-xs flex items-center justify-center rounded-full",
                active ? "bg-white text-primary" : "bg-gray-200"
              )}
            >
              {badge}
            </span>
          )}
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default CustomSidebarMenuItem;
