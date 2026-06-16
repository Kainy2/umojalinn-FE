"use client";
import { ProfilePhotoEdit } from "@/components/custom/picker/ProfilePhoto";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProfileTab from "@/section/dashboard/profile/Tab";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession();
  const isDesigner = session?.user?.profileRole === "DESIGNER";

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <ProfilePhotoEdit />
        {isDesigner && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings/profile-buyer-view">View as Buyer</Link>
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-subtitle-2 font-semibold text-foreground mb-1">
            Profile
          </h1>
          <p className="text-foreground-body">
            Update your photo and personal details here
          </p>
        </div>
      </div>
      <Separator className="bg-border/50 my-8" />
      <ProfileTab />

      {children}
    </>
  );
};

export default Layout;
