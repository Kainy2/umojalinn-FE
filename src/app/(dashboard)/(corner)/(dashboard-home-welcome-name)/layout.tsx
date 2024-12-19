import WelcomeName from "@/section/dashboard/home/WelcomeName";
import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <>
      <WelcomeName />
      {children}
    </>
  );
};

export default layout;
