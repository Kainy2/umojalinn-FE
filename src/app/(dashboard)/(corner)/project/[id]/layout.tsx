import ProjectTab from "@/section/dashboard/project/Tab";

import React from "react";

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Create Project</h1>
      <ProjectTab />
      {children}
    </>
  );
};

export default Layout;
