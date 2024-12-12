import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardSidebarHeader = () => {
  return (
    <SidebarHeader className="flex items-center justify-center flex-col p-4">
      <Image src="/img/png/umoja.png" alt="Umoja logo" height={80} width={80} />
      <Button
        asChild
        fullWidth
        variant="outline"
        className="text-primary text-sm"
      >
        <Link href="/project/create">
          <Plus />
          Create project
        </Link>
      </Button>
    </SidebarHeader>
  );
};

export default DashboardSidebarHeader;
