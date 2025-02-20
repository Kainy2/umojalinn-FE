import ActiveProjectSummary from "@/section/dashboard/project/active/Summary";
import ActiveProjectTab from "@/section/dashboard/project/active/Tab";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ActiveProjectSummary isDesigner />
      <ActiveProjectTab baseUrlSlug="active-jobs" />
      {children}
    </>
  );
};

export default Layout;
