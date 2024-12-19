import NavTab from "@/section/dashboard/home/NavTab";
import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavTab />
      {children}
    </>
  );
};

export default layout;
