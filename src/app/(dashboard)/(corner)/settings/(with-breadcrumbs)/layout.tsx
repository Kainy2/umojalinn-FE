import SettingsPageTitle from "@/components/custom/card/SettingsPageTitle";
import { Settings, Slash } from "lucide-react";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex flex-row gap-4 mb-12 items-center [&>svg]:size-4 text-foreground-body">
        <Link href="/settings">
          <Settings className="text-gray-500" />
        </Link>
        <Slash className="text-gray-300" />
        <SettingsPageTitle />
      </div>
      {children}
    </>
  );
};

export default Layout;
