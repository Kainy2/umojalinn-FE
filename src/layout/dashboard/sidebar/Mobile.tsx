"use client";
import React from "react";
import { DashbordSidebarFooterContent } from "./Footer";
import CustomSidebarMenu from "@/components/custom/sidebar/Menu";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const MobileMenu = () => {
  const { data: session } = useSession();

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button className="md:hidden" variant="ghost">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-[350px] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="hidden">Menu</DrawerTitle>
          <Image
            src="/img/png/umoja.png"
            alt="Umoja logo"
            height={80}
            width={80}
            className="block mx-auto"
          />
          <Button
            // asChild
            fullWidth
            variant="outline"
            className="text-primary text-sm"
            disabled
          >
            <span className="flex items-center gap-1">
              <Plus />
              {isDesigner ? "Share your work" : "Create project"}
            </span>
          </Button>
        </DrawerHeader>
        <div className="flex-1">
          <CustomSidebarMenu
            isMobile
            profileRole={session?.user?.profileRole}
          />
        </div>
        <DrawerFooter>
          <div className="flex gap-2 items-center">
            <DashbordSidebarFooterContent
              action={
                <LogOut
                  className="cursor-pointer"
                  onClick={() =>
                    signOut({ callbackUrl: "/login", redirect: true })
                  }
                />
              }
            />
          </div>
        </DrawerFooter>
        {/* <CustomSidebarMenu isMobile profileRole={token?.user?.profileRole} />
        <DashbordSidebarFooter isMobile /> */}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
