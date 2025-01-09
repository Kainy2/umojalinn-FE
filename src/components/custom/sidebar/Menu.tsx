"use client";
import React from "react";
import { SidebarMenu } from "@/components/ui/sidebar";
import CustomSidebarMenuItem from "@/components/custom/sidebar/MenuItem";
import { UmojaLinnUserRole } from "@/types/user";
import {
  BUYERS_SIDEBAR_CONTENT,
  DESIGNERS_SIDEBAR_CONTENT,
} from "@/constant/navigation";

const CustomSidebarMenu = (props: {
  profileRole?: UmojaLinnUserRole | null;
}) => {
  if (!props.profileRole) {
    return null;
  }

  const items =
    props.profileRole === "DESIGNER"
      ? DESIGNERS_SIDEBAR_CONTENT
      : BUYERS_SIDEBAR_CONTENT;

  return (
    <SidebarMenu>
      {items.map((item) => (
        <CustomSidebarMenuItem {...item} key={item.title} />
      ))}
    </SidebarMenu>
  );
};

export default CustomSidebarMenu;
