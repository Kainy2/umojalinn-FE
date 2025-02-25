"use client";
import React from "react";
import { DashbordSidebarFooterContent } from "./Footer";
import CustomSidebarMenu from "@/components/custom/sidebar/Menu";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const MobileMenu = () => {
  const { data: session } = useSession();

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] flex flex-col">
        <SheetHeader>
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
        </SheetHeader>
        <div className="flex-1">
          <CustomSidebarMenu
            isMobile
            profileRole={session?.user?.profileRole}
          />
        </div>
        <SheetFooter>
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
        </SheetFooter>
        {/* <CustomSidebarMenu isMobile profileRole={token?.user?.profileRole} />
        <DashbordSidebarFooter isMobile /> */}
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
