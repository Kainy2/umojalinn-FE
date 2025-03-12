"use client";
import React from "react";
import { DashbordSidebarFooterContent } from "./Footer";
import CustomSidebarMenu from "@/components/custom/sidebar/Menu";
import { Button } from "@/components/ui/button";
import {
  AlignLeft,
  LogOut,
  //  Plus
} from "lucide-react";
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

  // const isDesigner = session?.user?.profileRole === "DESIGNER";

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button className="md:hidden" variant="ghost">
          <AlignLeft className="!size-6" />
        </Button>
      </DrawerTrigger>
      {/* fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background w-full max-w-[350px] */}
      <DrawerContent className="w-full max-w-[350px] !rounded-none !m-0">
        <div className="h-[100dvh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle className="hidden">Menu</DrawerTitle>
            <Image
              src="/img/png/umoja.png"
              alt="Umoja logo"
              height={50}
              width={50}
              className="block mx-0 md:mx-auto"
            />
            {/* <Button
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
            </Button> */}
          </DrawerHeader>
          <div className="flex-1 overflow-scroll">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
