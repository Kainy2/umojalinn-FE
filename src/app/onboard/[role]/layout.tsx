import OnboardTab from "@/section/onboard/Tab";
import { redirect } from "next/navigation";
import React from "react";

const OnboardLayout = async ({
  children,
  params,
}: LayoutProps & { params: { role: string } }) => {
  const { role } = await params;
  if (!["buyer", "designer"].includes(role?.toLocaleLowerCase?.())) {
    return redirect("/unauthorized");
  }

  return (
    <div className="bg-auth">
      <div className="relative py-24">
        <div className="flex flex-col items-center text-center mb-4">
          <p className="font-semibold text-primary mb-2">Hold On champ!</p>
          <h1 className="text-xl font-bold text-foreground mb-8">
            We are almost there!
          </h1>
          <p className="text-subtitle mb-8">We just need...</p>
        </div>
        <div className="container flex md:block mb-20 justify-center">
          <OnboardTab />
        </div>
        <div className="container max-w-screen-md">{children}</div>
      </div>
    </div>
  );
};

export default OnboardLayout;
