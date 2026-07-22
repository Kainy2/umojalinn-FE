"use client";
import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import Image from "next/image";
import { logOut } from "@/lib/auth";
import {
  TOUR_MOBILE_MENU_EVENT,
  type TTourMobileMenuEventDetail,
} from "@/lib/tour";

const MobileMenu = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [lockedForTour, setLockedForTour] = useState(false);

  // const isDesigner = session?.user?.profileRole === "DESIGNER";

  useEffect(() => {
    const handleTourMobileMenu = (event: Event) => {
      const { open: nextOpen, locked } = (
        event as CustomEvent<TTourMobileMenuEventDetail>
      ).detail;
      setLockedForTour(locked);
      setOpen(nextOpen);
    };

    window.addEventListener(TOUR_MOBILE_MENU_EVENT, handleTourMobileMenu);

    return () => {
      window.removeEventListener(TOUR_MOBILE_MENU_EVENT, handleTourMobileMenu);
    };
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    // Tour card Next/Prev clicks sit outside the drawer and would otherwise
    // dismiss it (racing our open call → alternating open/closed steps).
    if (!nextOpen && lockedForTour) {
      return;
    }

    setOpen(nextOpen);
  };

  return (
    <Drawer direction="left" open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button className="md:hidden" variant="ghost">
          <AlignLeft className="!size-6" />
        </Button>
      </DrawerTrigger>
      {/* fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background w-full max-w-[350px] */}
      <DrawerContent
        className="w-full max-w-[350px] !rounded-none !m-0 z-[190]"
        onPointerDownOutside={
          lockedForTour ? (event) => event.preventDefault() : undefined
        }
        onInteractOutside={
          lockedForTour ? (event) => event.preventDefault() : undefined
        }
      >
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
                      logOut(session?.user?.profileRole, {
                        callbackUrl: "/login",
                        redirect: true,
                      })
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
