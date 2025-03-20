import Link from "next/link";
import React from "react";

export type SettingsCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const SettingsCard = (props: SettingsCardProps) => {
  return (
    <Link
      href={props.href}
      className="border border-gray-300 p-8 [&>svg]:size-14 [&>svg]:text-primary [&>svg]:mb-4 [&>svg]:stroke-1"
    >
      {props.icon}
      <h3 className="text-subtitle-2 font-semibold text-foreground mb-1">
        {props.title}
      </h3>
      <p className="text-foreground-body text-sm">{props.description}</p>
    </Link>
  );
};

export default SettingsCard;
