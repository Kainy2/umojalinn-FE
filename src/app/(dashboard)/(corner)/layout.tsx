import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return <div className="bg-corner p-4 md:p-8 lg:p-12">{children}</div>;
};

export default Layout;
