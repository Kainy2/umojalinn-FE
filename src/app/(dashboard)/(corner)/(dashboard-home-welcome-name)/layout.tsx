import WelcomeName from "@/section/dashboard/home/WelcomeName";
import FundProjectAlert from "@/section/dashboard/project/FundAlert";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <FundProjectAlert />
      <WelcomeName />
      {children}
    </>
  );
};

export default Layout;
