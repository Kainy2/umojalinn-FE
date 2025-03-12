"use client";
import { UmojaLinnSizingTemplate } from "@/types/project";
import React from "react";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Eye } from "lucide-react";

const SizingTemplateCard = (props: { template: UmojaLinnSizingTemplate }) => {
  const { template } = props;
  const { data: session } = useSession();

  const isBuyer = session?.user?.profileRole === "BUYER";

  const inUse = template?.status === "IN_USE";
  const isDraft = template?.status === "DRAFT"
  const projectInUse = template?.projects?.find(
    (temp) => temp?.status !== "COMPLETED"
  );

  return (
    <SizingTemplateDialog id={template?.id}>
      <button className="relative h-52">
        <Image
          src={
            session?.user?.profileRole === "BUYER"
              ? "/img/webp/sizing-template-card.webp"
              : "/img/webp/sizing-template-designer-card.webp"
          }
          alt=""
          className="absolute object-center object-cover"
          fill
        />
        <div
          className={cn(
            "absolute bottom-0 p-4 backdrop-blur-md bg-white/30 border-t-1 border-white/50 w-full",
            isBuyer &&
            inUse &&
            "h-full border-none flex flex-col items-center justify-center "
          )}
        >
          {isBuyer ? (
            <>
              <h2 className="text-subtitle-2 font-bold text-center truncate w-full">
                {template?.name}
              </h2>
              {(inUse || isDraft) && <p className="text-primary font-semibold">{isDraft ? "Draft" : "In use"}</p>}
            </>
          ) : (
            <div className="flex gap-2 text-left items-center">
              <Image
                alt=""
                src={
                  template?.buyer?.user?.profilePhotoUri || "/img/webp/user.webp"
                }
                height={150}
                width={150}
                className="object-cover object-center rounded-full aspect-square shrink-0 size-12"
              />
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-subtitle-2 font-bold truncate w-full">
                  {template?.name}
                </h2>
                {projectInUse?.title && (
                  <p className="text-foreground-body text-sm truncate w-full">
                    {projectInUse?.title}
                  </p>
                )}
              </div>
              <span className="bg-primary-50 text-primary p-1.5 rounded-full aspect-square shrink-0">
                <Eye />
              </span>
            </div>
          )}
        </div>
        {isBuyer && inUse && !!projectInUse && (
          <span className="absolute top-2 left-2 px-4 py-2 bg-primary text-white">
            {projectInUse?.title}
          </span>
        )}
      </button>
    </SizingTemplateDialog>
  );
};

export default SizingTemplateCard;
