import { ProfilePhotoEdit } from "@/components/custom/picker/ProfilePhoto";
import { Separator } from "@/components/ui/separator";
import ProfileTab from "@/section/dashboard/profile/Tab";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <ProfilePhotoEdit />
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
