import Collapsible from "@/components/custom/Collapsible";
import LabelBadge from "@/components/custom/LabelBadge";
import { UmojaLinnProject } from "@/types/project";
import { formatDate } from "date-fns";
import Image from "next/image";
import React from "react";

const ProjectReviewView = (props: { project?: UmojaLinnProject }) => {
  return (
    <>
      <div className="p-4 bg-slate-100 mb-4">
        <h3 className="text-md font-semibold text-foreground-body mb-1">
          {props?.project?.title || "No title"}
        </h3>
        <p className="text-muted-foreground text-sm mb-8">
          {props?.project?.about || "No description"}
        </p>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Project due:{" "}
            <span className="font-semibold">
              {props?.project?.dueDate
                ? formatDate(props?.project?.dueDate, "MMM dd, yyyy")
                : "None"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Project budget:{" "}
            <span className="font-semibold">
              {props?.project?.currency === "EURO" && "€"}
              {props?.project?.currency === "NAIRA" && "₦"}
              {props?.project?.budget || "0"}
            </span>
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-foreground mb-2">
          Project Gallery
        </h3>
        <div className="flex flex-row gap-4">
          {props?.project?.Gallery?.map?.((gallery) => (
            <Image
              key={gallery.id}
              alt=""
              src={gallery.imageUrl}
              className="shrink-0 aspect-video object-cover"
              width={310}
              height={170}
            />
          ))}
        </div>
      </div>
      <Collapsible title="Delivery Details">
        <LabelBadge title="Country" value={props?.project?.country} />
        <LabelBadge title="City" value={props?.project?.city} />
        <LabelBadge
          title="Province / State / Zip code"
          value={[props?.project?.state, props?.project?.zipCode]}
        />
        <LabelBadge title="Address" value={props?.project?.address} />
      </Collapsible>
      <Collapsible title="Other Details">
        <LabelBadge
          title="Clothing type"
          value={props?.project?.clothingTypes?.map?.((type) => type.name)}
        />
        {/* <LabelBadge
          title="Specialist"
          value={props?.project?.specialist}
        /> */}
        {/* <LabelBadge
          title="Experience Level"
          value={props?.project?.experienceLevel}
        /> */}
      </Collapsible>
      <div className="flex justify-between">
        <h3 className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4">
          Designer
        </h3>
        <p className="p-1 pr-3 text-sm flex items-center gap-2 rounded-full shrink-0 font-semibold bg-slate-100 text-foreground-body">
          <span className="shrink-0 relative">
            <Image
              alt=""
              src={
                props?.project?.designer?.user?.profilePhotoUri ||
                "/img/webp/user.webp"
              }
              height={25}
              width={25}
              className="rounded-full shrink-0 relative"
            />
          </span>
          <span className="whitespace-nowrap">
            {props?.project?.designer?.user?.firstName}{" "}
            {props?.project?.designer?.user?.lastName}
          </span>
        </p>
      </div>
    </>
  );
};

export default ProjectReviewView;
