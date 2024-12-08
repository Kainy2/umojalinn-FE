"use client";
import CustomTab from "@/components/custom/Tab";
import { useParams, usePathname } from "next/navigation";
import React, { useMemo } from "react";

const OnboardTab = () => {
  const params = useParams<{ role: string }>();
  const path = usePathname();

  const { role } = params;

  const tabs = useMemo(
    () => [
      {
        title: "Your details",
        description: "Let's get personal! Tell me all the juicy details",
        href: `/onboard/${role}`,
      },
      {
        title: "Your address",
        description: "Give us the coordinates of your secret lair",
        href: `/onboard/${role}/address`,
      },
      {
        title: "Your profile picture",
        description: "One tiny, little detail",
        href: `/onboard/${role}/profile-picture`,
      },
    ],
    [role]
  );

  const active = useMemo(
    () => tabs.find((tab) => tab.href === path)?.title || "",
    [path, tabs]
  );

  return <CustomTab active={active} tabs={tabs} />;
};

export default OnboardTab;
