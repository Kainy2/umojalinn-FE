import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export type MenuButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
};

type MenuButtonWrapperProps = Pick<
  MenuButtonProps,
  "className" | "onClick" | "href"
> & {
  children: React.ReactNode;
};

const MenuButtonWrapper = (props: MenuButtonWrapperProps) => {
  if (props.href) {
    return (
      <Link
        className={props.className}
        href={props.href}
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

const MenuButton = (props: MenuButtonProps) => {
  return (
    <MenuButtonWrapper
      href={props.href}
      onClick={props.onClick}
      className={cn(
        "flex w-full text-foreground-body items-center gap-2 overflow-hidden text-left outline-none ring-sidebar-ring focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm rounded-none p-3 h-10",
        props.className
      )}
    >
      {props.icon}
      <span>{props.children}</span>
    </MenuButtonWrapper>
  );
};

export default MenuButton;
