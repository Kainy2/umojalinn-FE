import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type AvatarIconTagProps = {
  avatar?: {
    src?: string | null;
  };
  label: string;
  icon?: "CHECK" | React.ReactNode;
  className?: string;
  onClick?: React.ComponentProps<"button">["onClick"];
  disabled?: boolean;
};

const AvatarIconTag = (props: AvatarIconTagProps) => {
  return (
    <button
      onClick={props.onClick}
      className={cn(
        "p-1 text-sm inline-flex items-center gap-2 rounded-full shrink-0 bg-gray-100 text-foreground-body",
        !props.icon && "pr-3",
        !props.avatar && "pl-3",
        !!props.avatar && "font-semibold",
        props.className
      )}
      disabled={props.disabled}
    >
      {props.avatar && (
        <span className="shrink-0 relative">
          <Image
            alt=""
            src={props.avatar?.src || "/img/webp/user.webp"}
            height={25}
            width={25}
            className="rounded-full w-10 h-10 shrink-0 relative"
          />
        </span>
      )}
      <span className="whitespace-nowrap">{props?.label}</span>
      {props.icon}
    </button>
  );
};

export default AvatarIconTag;
