import { Slash, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="">
      <div className="flex items-center gap-4 [&>svg]:size-4 text-foreground-body mb-10">
        <Wallet />
        <Slash className="text-gray-300" />
        <Link href="/wallet">Wallet</Link>
        <Slash className="text-gray-300" />
        <p className="font-semibold">Withdraw</p>
      </div>

      <h1 className="text-subtitle-1 font-bold text-foreground mb-1">
        Withdrawal method
      </h1>
      <p className="text-foreground-body">Update your withdrawal methods</p>
      <Separator className="bg-gray-200 my-8" />
      {children}
    </div>
  );
};

export default Layout;
