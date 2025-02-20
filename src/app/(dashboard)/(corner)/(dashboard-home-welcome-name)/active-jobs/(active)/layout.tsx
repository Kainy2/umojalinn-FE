import ActiveProjectCardList from "@/section/dashboard/project/cardList/Active";
import { LayoutGrid, Slash } from "lucide-react";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex flex-row gap-4 mb-4 items-center [&>svg]:size-4 text-foreground-body">
        <LayoutGrid className="text-gray-500" />
        <Slash className="text-gray-300" />
        <p className="uppercase px-2 text-sm font-semibold py-1 bg-gray-50 rounded-md">
          My active jobs
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <ActiveProjectCardList baseUrlSlug="active-jobs" />
        {children}
      </div>
    </>
  );
};

export default Layout;
