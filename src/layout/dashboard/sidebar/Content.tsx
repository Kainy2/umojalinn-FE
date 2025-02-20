import CustomSidebarMenu from "@/components/custom/sidebar/Menu";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

import React from "react";

const DashboardSidebarContent = async () => {
  const token = await auth();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <CustomSidebarMenu profileRole={token?.user?.profileRole} />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default DashboardSidebarContent;
