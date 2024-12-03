import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-auth">
      <div className="relative">{children}</div>
    </div>
  );
};

export default layout;
