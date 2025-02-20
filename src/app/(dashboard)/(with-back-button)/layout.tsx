import BackButton from "@/components/custom/BackButton";
import React from "react";

const LayoutWithBackButton = ({ children }: LayoutProps) => {
  return (
    <>
      <BackButton />
      <div className="p-4 md:p-8 lg:p-12">{children}</div>
    </>
  );
};

export default LayoutWithBackButton;
