import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import Collapsible from "@/components/custom/Collapsible";
import LabelBadge from "@/components/custom/LabelBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnProject } from "@/types/project";
import { formatDate } from "date-fns";
import Image from "next/image";
import React from "react";

const ProjectReviewView = (props: {
  project?: UmojaLinnProject;
  loading?: boolean;
}) => {
  if (props.loading) {
    return (
      <>
        <Skeleton className="h-36" />
        <div>
          <Skeleton className="h-6 mb-2 w-full max-w-24" />
          <Skeleton className="aspect-square w-full max-w-36" />
        </div>
        <div>
          <Skeleton className="w-full h-6 max-w-20 mb-4" />
          <div className="flex flex-col gap-8">
            {new Array(4).fill("").map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 lg:flex-row lg:justify-between"
              >
                <Skeleton className="h-4 w-full max-w-20" />
                <Skeleton className="h-5 w-full max-w-32" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="w-full h-6 max-w-20 mb-4" />
          <div className="flex flex-col gap-8">
            {new Array(2).fill("").map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 lg:flex-row lg:justify-between"
              >
                <Skeleton className="h-4 w-full max-w-20" />
                <Skeleton className="h-5 w-full max-w-32" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="p-4 bg-gray-100 mb-4">
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
              {getCurrencySymbol(props?.project?.currency)}
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
              src={gallery.imageUrl || "/img/svg/null.svg"}
              className="shrink-0 aspect-video object-cover"
              width={310}
              height={170}
            />
          ))}
        </div>
      </div>
      <Collapsible title="Delivery Details">
        <LabelBadge
          title="Country"
          value={props?.project?.deliveryAddress?.country}
        />
        <LabelBadge
          title="City"
          value={props?.project?.deliveryAddress?.city}
        />
        <LabelBadge
          title="Province / State / Zip code"
          value={[
            props?.project?.deliveryAddress?.state,
            props?.project?.deliveryAddress?.zipCode,
          ]}
        />
        <LabelBadge
          title="Address"
          value={props?.project?.deliveryAddress?.address}
        />
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
        <AvatarIconTag
          avatar={{
            src: props?.project?.designer?.user?.profilePhotoUri,
          }}
          label={`${props?.project?.designer?.user?.firstName} ${props?.project?.designer?.user?.lastName}`}
        />
      </div>
    </>
  );
};

export default ProjectReviewView;
