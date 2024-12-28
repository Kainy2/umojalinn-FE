import { auth } from "@/lib/auth";
import NavTab from "@/section/dashboard/home/NavTab";
import React from "react";

const layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  return (
    <>
      <NavTab role={session?.user?.profileRole!} />
      {children}
    </>
  );
};

export default layout;
