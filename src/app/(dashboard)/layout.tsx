import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-center flex-col p-4">
          <Image
            src="/img/png/umoja.png"
            alt="Umoja logo"
            height={80}
            width={80}
          />
          <Button asChild fullWidth variant="outline" className="text-primary">
            <Link href="/project/create">
              <Plus />
              Create project
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main>
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
