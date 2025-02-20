import WelcomeName from "@/section/dashboard/home/WelcomeName";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <WelcomeName />
      {children}
    </>
  );
};

export default Layout;
