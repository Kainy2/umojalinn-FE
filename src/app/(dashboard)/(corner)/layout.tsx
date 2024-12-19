import React from "react";

const layout = ({ children }: LayoutProps) => {
  return <div className="bg-corner p-12">{children}</div>;
};

export default layout;
