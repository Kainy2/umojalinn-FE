import BackButton from "@/components/custom/BackButton";
import React from "react";

const LayoutWithBackButton = ({ children }: LayoutProps) => {
  return (
    <>
      <BackButton />
      <div className="p-12">{children}</div>
    </>
  );
};

export default LayoutWithBackButton;
