import JobsHeader from "@/section/dashboard/job/Header";
import JobsTab from "@/section/dashboard/job/Tab";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <JobsHeader />
      <div className="container flex flex-col gap-4 mt-4">
        <JobsTab />
        {children}
      </div>
    </>
  );
};

export default Layout;
