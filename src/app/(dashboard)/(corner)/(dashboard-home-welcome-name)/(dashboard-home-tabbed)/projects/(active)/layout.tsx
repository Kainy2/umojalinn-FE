import ActiveProjectCardList from "@/section/dashboard/project/cardList/Active";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col gap-8">
      <ActiveProjectCardList />
      {children}
    </div>
  );
};

export default Layout;
