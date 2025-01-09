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
          { title: "All Templates" },
          { title: "Templates in use" },
          { title: "Drafts" },
        ]}
      />
      {children}
    </>
  );
};

export default Layout;
