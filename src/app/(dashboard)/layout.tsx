import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebarContent from "@/layout/dashboard/sidebar/Content";
import DashbordSidebarFooter from "@/layout/dashboard/sidebar/Footer";
import DashboardSidebarHeader from "@/layout/dashboard/sidebar/Header";
import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardSidebarHeader />
        <DashboardSidebarContent />
        <DashbordSidebarFooter />
      </Sidebar>
      <main>
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
