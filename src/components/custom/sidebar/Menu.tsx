"use client";
import React from "react";
import { SidebarMenu } from "@/components/ui/sidebar";
import CustomSidebarMenuItem from "@/components/custom/sidebar/MenuItem";
import { UmojaLinnUserRole } from "@/types/user";
import {
  BUYERS_SIDEBAR_CONTENT,
  DESIGNERS_SIDEBAR_CONTENT,
} from "@/constant/navigation";
import { cn } from "@/lib/utils";

const CustomSidebarMenu = (props: {
  profileRole?: UmojaLinnUserRole | null;
  isMobile?: boolean;
}) => {
  if (!props.profileRole) {
    return null;
  }

  const Menu = props.isMobile ? "div" : SidebarMenu;

  const items =
    props.profileRole === "DESIGNER"
      ? DESIGNERS_SIDEBAR_CONTENT
      : BUYERS_SIDEBAR_CONTENT;

  return (
    <Menu className={cn(props.isMobile && "flex flex-col gap-1")}>
      {items.map((item) => (
        <CustomSidebarMenuItem
          {...item}
          key={item.title}
          isMobile={props.isMobile}
        />
      ))}
    </Menu>
  );
};

export default CustomSidebarMenu;
