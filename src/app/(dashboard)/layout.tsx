import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import DashboardAppbarContent from "@/layout/dashboard/appbar/Content";
import DashboardSidebarContent from "@/layout/dashboard/sidebar/Content";
import DashbordSidebarFooter from "@/layout/dashboard/sidebar/Footer";
import DashboardSidebarHeader from "@/layout/dashboard/sidebar/Header";
import NextStepTourProvider from "@/components/provider/NextStepTour";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <NextStepTourProvider>
      <SidebarProvider>
        <Sidebar>
          <DashboardSidebarHeader />
          <DashboardSidebarContent />
          <DashbordSidebarFooter />
        </Sidebar>
        <main className="relative">
          {/* <SidebarTrigger /> */}
          <div className="h-16 md:h-24 p-4 md:p-8 lg:p-12 md:pl-0 flex  items-center justify-between sticky z-50 top-0 bg-background">
            <DashboardAppbarContent />
          </div>
          <div className="dashboard-content">{children}</div>
        </main>
      </SidebarProvider>
    </NextStepTourProvider>
  );
};

export default Layout;
