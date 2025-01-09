import CustomTab from "@/components/custom/tab";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Sizing Template</h1>
      <CustomTab
        className="mb-4"
        type="NAVIGATOR"
        active="All Templates"
        tabs={[
          { title: "All Templates", count: 0 },
          { title: "Templates in use", count: 0 },
          { title: "Drafts", count: 0 },
        ]}
      />
      {children}
    </>
  );
};

export default Layout;
