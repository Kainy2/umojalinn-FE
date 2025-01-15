"use client";
import TextField from "@/components/custom/input/TextField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InviteClient from "@/section/dashboard/appbar/InviteClient";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardAppbarContent = () => {
  const { data: meData } = useGetMe();
  const me = meData?.data?.data;
  const { data: session } = useSession();

  return (
    <>
      <div className="flex-1 max-w-96">
        <TextField
          className="focus-visible:!ring-transparent !ring-transparent transition-none"
          placeholder="Search"
          startAdornment={
            <Search className="text-muted-foreground icon-base" />
          }
        />
      </div>
      <div className="flex space-x-1 items-center ">
        {session?.user?.profileRole === "DESIGNER" && (
          <>
            <InviteClient />
            <Separator orientation="vertical" className="h-8" />
          </>
        )}
        <Button variant="ghost" className="font-normal">
          <Bell className="icon-base" />
        </Button>
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
      </div>
    </>
  );
};

export default DashboardAppbarContent;
