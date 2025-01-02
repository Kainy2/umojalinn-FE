import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return <div className="bg-corner p-12">{children}</div>;
};

export default Layout;
