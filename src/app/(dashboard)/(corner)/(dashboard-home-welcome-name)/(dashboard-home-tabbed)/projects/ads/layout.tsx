import AdsProjectCardList from "@/section/dashboard/project/cardList/Ads";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col gap-8">
      <AdsProjectCardList />
      {children}
    </div>
  );
};

export default Layout;
