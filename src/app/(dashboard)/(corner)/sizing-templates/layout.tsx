import SizigTemplateTab from "@/section/sizing-template/Tab";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Sizing Template</h1>
      <SizigTemplateTab />
      {children}
    </>
  );
};

export default Layout;
