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
import { Plus } from "lucide-react";

const CustomSidebarMenu = (props: {
  profileRole?: UmojaLinnUserRole | null;
  isMobile?: boolean;
}) => {
  if (!props.profileRole) {
    return null;
  }

  const Menu = props.isMobile ? "div" : SidebarMenu;
  const isDesigner = props.profileRole === "DESIGNER";
  const items =
    isDesigner
      ? DESIGNERS_SIDEBAR_CONTENT
      : BUYERS_SIDEBAR_CONTENT;

      // {
      //   title: "Share your work",
      //   url: "/share-your-work",
      //   icon: <ImageIcon />,
      //   regex: /^\/share-your-work$/,
      // },
  return (
    <Menu className={cn(props.isMobile && "flex flex-col gap-1 pb-8")}>
      {isDesigner && (
        <div className="border text-primary mb-4">
          <CustomSidebarMenuItem
            title="Share your work"
            url="/share-your-work"
            icon={<Plus className="text-primary h-5 w-5" />}
            isMobile={props.isMobile}
          />
        </div>
      )}

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
