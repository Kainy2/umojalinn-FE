"use client";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

const DashbordSidebarFooterContent = (props: {
  action?: React.ReactElement;
}) => {
  const { data, isPending } = useGetMe();

  const me = data?.data?.data;

  if (isPending) {
    return (
      <>
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 mb-2 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        {props.action}
      </>
    );
  }

  return (
    <>
      <Image
        src={me?.profilePhotoUri || "/img/webp/user.webp"}
        alt=""
        height={40}
        width={40}
        className="object-cover object-center rounded-full shrink-0"
      />
      <div className="flex-1 truncate overflow-hidden">
        <h5 className="text-sm font-bold leading-normal truncate overflow-hidden">
          {me?.firstName} {me?.lastName}
        </h5>
        <p className="text-sm text-gray-500 leading-normal truncate overflow-hidden">
          {me?.email}
        </p>
      </div>
      {props.action}
    </>
  );
};

const DashbordSidebarFooter = () => {
  return (
    <SidebarFooter className="">
      <div className="flex gap-2 items-center">
        <DashbordSidebarFooterContent
          action={
            <LogOut
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
            />
          }
        />
      </div>
    </SidebarFooter>
  );
};

export default DashbordSidebarFooter;
