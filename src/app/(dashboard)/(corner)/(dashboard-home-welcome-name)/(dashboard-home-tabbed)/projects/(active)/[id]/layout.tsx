import ActiveProjectSummary from "@/section/dashboard/project/active/Summary";
import ActiveProjectTab from "@/section/dashboard/project/active/Tab";
import FundProjectAlert from "@/section/dashboard/project/FundAlert";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ActiveProjectSummary />
      <ActiveProjectTab />
      <FundProjectAlert />
      {children}
    </>
  );
};

export default Layout;
