"use client";
// import TextField from "@/components/custom/input/TextField";
import NotificationPopover from "@/components/custom/popover/Notification";
import PopoverMenu from "@/components/custom/PopoverMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InviteClient from "@/section/dashboard/appbar/InviteClient";
import { useGetMe } from "@/tanstack/hooks/useUser";
import {
  ChevronDown, LogOut,
  // Search 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import MobileMenu from "../sidebar/Mobile";
import Image from "next/image";

const DashboardAppbarContent = () => {
  const { data: meData } = useGetMe();
  const me = meData?.data?.data;
  const { data: session } = useSession();

  return (
    <>
      <div className="flex space-x-1 items-center flex-1 max-w-96">
        <Image
          className="inline object-contain md:hidden"
          alt="Umojalinn Logo"
          src="/img/png/umoja.png"
          width={20}
          height={20}
        />
        <MobileMenu />
        <div className="hidden lg:block">
          {/* <TextField
            className=" focus-visible:!ring-transparent !ring-transparent transition-none"
            placeholder="Search"
            startAdornment={
              <Search className="text-muted-foreground icon-base" />
            }
          /> */}
        </div>
      </div>
      <div className="flex space-x-1 items-center ">
        {session?.user?.profileRole === "DESIGNER" && (
          <>
            <InviteClient />
            <Separator orientation="vertical" className="h-8" />
          </>
        )}
        <NotificationPopover />
        <PopoverMenu
          menus={[
            {
              onClick: () => signOut(),
              children: "Logout",
              icon: <LogOut className="text-error" />,
            },
          ]}
        >
          <Button variant="ghost">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={me?.profilePhotoUri || ""}
                alt={me?.firstName}
              />
              <AvatarFallback>
                {me?.firstName?.[0]?.toLocaleUpperCase?.()}
                {me?.lastName?.[0]?.toLocaleUpperCase?.()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="icon-base" />
          </Button>
        </PopoverMenu>
      </div>
    </>
  );
};

export default DashboardAppbarContent;
