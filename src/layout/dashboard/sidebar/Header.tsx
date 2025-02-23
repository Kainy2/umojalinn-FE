import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import Image from "next/image";
// import Link from "next/link";
import React from "react";

const DashboardSidebarHeader = async () => {
  const token = await auth();

  return (
    <SidebarHeader className="flex items-center justify-center flex-col p-3">
      <Image src="/img/png/umoja.png" alt="Umoja logo" height={80} width={80} />
      <Button
        // asChild
        fullWidth
        variant="outline"
        className="text-primary text-sm"
        disabled
      >
        {/* <Link href="/project/create"> */}
        <span className="flex">
          <Plus />
          {token?.user?.profileRole === "DESIGNER"
            ? "Share your work"
            : "Create project"}
        </span>
        {/* </Link> */}
      </Button>
    </SidebarHeader>
  );
};

export default DashboardSidebarHeader;
