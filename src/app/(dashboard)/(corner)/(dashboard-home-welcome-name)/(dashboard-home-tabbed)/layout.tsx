import { auth } from "@/lib/auth";
import NavTab from "@/section/dashboard/home/NavTab";
import React from "react";

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  return (
    <>
      <NavTab role={session?.user?.profileRole} className="mb-2" />
      {children}
    </>
  );
};

export default Layout;
