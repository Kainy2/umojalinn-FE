import Image from "next/image";
import React from "react";

type CustomCardProps = {
  title: string;
  preTitle?: React.ReactElement;
  img?: string;
  description: string;
  preDescription?: React.ReactElement;
  action?: React.ReactElement;
};

const CustomCard = (props: CustomCardProps) => {
  return (
    <div className="bg-white p-4">
      <div className="flex gap-1.5 mb-4 items-center">
        {props.preTitle}
        <h3 className="text-md leading-none font-semibold">{props.title}</h3>
      </div>
      <div className="h-36 relative overflow-hidden mb-4">
        <Image
          fill
          src={props.img || ""}
          alt={props.title}
          className="relative object-cover"
        />
      </div>
      {props.preDescription}
      <p className="text-sm leading-normal mb-2 text-foreground-body">
        {props.description}
      </p>
      {props.action}
    </div>
  );
};

export default CustomCard;
