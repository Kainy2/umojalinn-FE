import { UmojaLinnSizingTemplate } from "@/types/project";
import React from "react";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SizingTemplateCard = (props: { template: UmojaLinnSizingTemplate }) => {
  const { template } = props;

  const inUse = template?.status === "IN_USE";
  const projectInUse = inUse
    ? template?.projects?.find((temp) => temp.status !== "COMPLETED")
    : undefined;
  return (
    <SizingTemplateDialog id={template?.id}>
      <button className="relative h-52">
        <Image
          src="/img/webp/sizing-template-card.webp"
          alt=""
          className="absolute object-center object-cover"
          fill
        />
        <div
          className={cn(
            "absolute bottom-0 p-4 backdrop-blur-lg bg-white/50 border-t-1 border-white/50 w-full",
            inUse &&
              "h-full border-none flex flex-col items-center justify-center "
          )}
        >
          <h2 className="text-subtitle-2 font-bold text-center truncate w-full">
            {template?.name}
          </h2>
          {inUse && <p className="text-primary font-semibold">In use</p>}
        </div>
        {!!projectInUse && (
          <span className="absolute top-2 left-2 px-4 py-2 bg-primary text-white">
            {projectInUse?.title}
          </span>
        )}
      </button>
    </SizingTemplateDialog>
  );
};

export default SizingTemplateCard;
