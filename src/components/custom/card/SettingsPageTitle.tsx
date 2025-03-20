"use client";
import { usePathname } from "next/navigation";
import React from "react";

const SettingsPageTitle = () => {
  const pathname = usePathname();
  const title = pathname.match(/\/settings\/([^\/]+)/)?.[1] || "";
  return (
    <p className="uppercase px-2 text-sm font-semibold py-1 bg-gray-50 rounded-md">
      {title}
    </p>
  );
};

export default SettingsPageTitle;
