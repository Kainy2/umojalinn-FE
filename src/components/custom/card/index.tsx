"use client";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ComponentProps } from "react";

export type CustomCardProps = {
  title: string;
  preTitle?: React.ReactNode;
  img?: string;
  description?: string;
  preDescription?: React.ReactElement;
  action?: React.ReactElement;
  color?: string;
  onClick?:
    | ComponentProps<"button">["onClick"]
    | ComponentProps<"a">["onClick"];
  type?: "DASHBOARD" | "PROJECT";
  href?: string;
};

const CustomCardWrapper = (props: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: CustomCardProps["onClick"];
  img?: string;
}) => {
  if (props.href) {
    return (
      <Link
        style={
          props.img
            ? {
                backgroundImage: `linear-gradient(180deg, 
    #eaeaea20,#eaeaead3, #eaeaea), url('${props.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        className={props.className}
        href={props.href}
        onClick={props.onClick as ComponentProps<"a">["onClick"]}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      style={
        props.img
          ? {
              backgroundImage: `linear-gradient(180deg, 
      rgba(241, 245, 249, 0), rgba(241, 245, 249, 0.8), rgba(241, 245, 249, 1)), url('${props.img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      className={props.className}
      type="button"
      onClick={props.onClick as ComponentProps<"button">["onClick"]}
    >
      {props.children}
    </button>
  );
};

const CustomCard = (props: CustomCardProps) => {
  if (props.type === "PROJECT") {
    return (
      <CustomCardWrapper
        img={props.img}
        href={props.href}
        onClick={props.onClick as ComponentProps<"a">["onClick"]}
        className={cn(
          "relative h-28 min-w-80 flex p-12 items-center justify-center border-b-2 border-gray-400 bg-gray-100",
          props.color === "primary" && "border-primary",
          props.color === "blue" && "border-blue-500",
          props.color === "error" && "border-error",
          props.color === "success" && "border-success"
        )}
      >
        {props.preTitle && (
          <span className="absolute top-2 left-2 p-1 rounded-full bg-background">
            <EyeOff className="h-3.5 w-3.5 text-primary" />
          </span>
        )}
        <h3 className="text-subtitle-2 font-semibold text-foreground">
          {props.title}
        </h3>
      </CustomCardWrapper>
    );
  }

  return (
    <CustomCardWrapper
      href={props.href}
      onClick={props.onClick}
      className="bg-white p-4 text-left"
    >
      <div className="flex gap-1.5 mb-4 items-center">
        {props.preTitle}
        <h3 className="text-md leading-none font-semibold">{props.title}</h3>
      </div>
      <div className="h-36 relative overflow-hidden mb-4">
        <Image
          fill
          src={props.img || "/img/svg/null.svg"}
          alt={props.title}
          className="relative object-cover"
        />
      </div>
      {props.preDescription}
      <p className="text-sm leading-normal mb-2 text-foreground-body">
        {props.description}
      </p>
      {props.action}
    </CustomCardWrapper>
  );
};

export default CustomCard;
