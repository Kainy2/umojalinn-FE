"use client";
import SettingsCard, {
  SettingsCardProps,
} from "@/components/custom/card/Settings";
import { Separator } from "@/components/ui/separator";
import { capitalizeFirstLetter } from "@/lib/string";
import { BellRing, CreditCard, FileText, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const SETTINGS: Array<SettingsCardProps> = [
  {
    title: "Profile",
    description:
      "Your name, contacts and other relevant information about yourself",
    icon: <FileText />,
    href: "/settings/profile",
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: <ShieldCheck />,
    description:
      "Manage password",
  },
  {
    title: "Notification",
    href: "/settings/notification",
    icon: <BellRing />,
    description: "Notifications and alert preference",
  },
];

const DESIGNER_SETTINGS: Array<SettingsCardProps> = [
  {
    title: "Payment",
    href: "/settings/payment",
    icon: <CreditCard />,
    description: "Manage your payment methods",
  },
];

const SettingPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-1">Settings</h1>
      <p className="text-foreground-body mb-4">
        Make changes to your{" "}
        <strong>
          {capitalizeFirstLetter(session?.user?.profileRole || "")}
        </strong>{" "}
        default settings
      </p>

      <Separator className="bg-border/50 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {SETTINGS?.map((setting) => (
          <SettingsCard {...setting} key={setting.title} />
        ))}
        {session?.user?.profileRole === "DESIGNER" &&
          DESIGNER_SETTINGS?.map((setting) => (
            <SettingsCard {...setting} key={setting.title} />
          ))}
      </div>
    </>
  );
};

export default SettingPage;
