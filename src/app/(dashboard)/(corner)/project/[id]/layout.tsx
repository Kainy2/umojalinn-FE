import { CreateProjectProvider } from "@/layout/create-project/CreateProjectProvider";
import ProjectTab from "@/section/dashboard/project/Tab";

import React from "react";

const Layout = async ({ children }: LayoutProps) => {
  return (
    <CreateProjectProvider>
      <h1 className="text-subtitle-1 font-bold mb-8">Create Project</h1>
      <ProjectTab />

      {children}
    </CreateProjectProvider>
  );
};

export default Layout;
