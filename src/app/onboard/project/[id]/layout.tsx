import ProjectTab from "@/section/dashboard/project/Tab";

import React from "react";

const Layout = async ({ children }: LayoutProps) => {
  return (
    <div className="bg-corner">
      <div className="container max-w-screen-lg py-24 px-4 md:px-8 lg:px-12">
        <h1 className="text-subtitle-1 font-bold mb-8">Create Project</h1>
        <ProjectTab isOnboarding />
        {children}
      </div>
    </div>
  );
};

export default Layout;
