import AvatarIconTag from "@/components/custom/tag/AvatarIcon";
import Collapsible from "@/components/custom/Collapsible";
import LabelBadge from "@/components/custom/LabelBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency, UmojaLinnProject } from "@/types/project";
import { formatDate } from "date-fns";
import React from "react";
import GalleryImages from "@/components/custom/GalleryImages";
import { formatCurrencyValue } from "@/lib/number";
import { StateType } from "@/layout/create-project/CreateProjectProvider";
import { useGetClothingTypes } from "@/tanstack/hooks/useProject";
import { cn } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ProjectReviewView = (props: {
  project?: UmojaLinnProject;
  projectFormDetails?: StateType;
  loading?: boolean;
}) => {
  const { projectFormDetails } = props
  const { data } = useGetClothingTypes()
  const router = useRouter();
  const { data: session } = useSession();
  
  const isDesigner = session?.user?.profileRole === "DESIGNER";
  const allClothingTypes = data?.data?.data

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
      <div className="p-4 mt-2 lg:mt-0 bg-gray-100 mb-4">
        <h3 className="text-md font-semibold text-foreground-body mb-1">
          {projectFormDetails?.title || props?.project?.title || "No title"}
        </h3>
        <p className="text-muted-foreground text-sm mb-8 break-words whitespace-pre-wrap">
          {projectFormDetails?.about || props?.project?.about || "No description"}
        </p>
        <div className="flex gap-4 flex-col lg:flex-row justify-between">
          <p className="text-sm text-muted-foreground">
            Project due:{" "}
            <span className="font-semibold">
              {
                projectFormDetails?.dueDate
                  ? formatDate(projectFormDetails?.dueDate, "MMM dd, yyyy")
                  : props?.project?.dueDate
                    ? formatDate(props?.project?.dueDate, "MMM dd, yyyy")
                    : "None"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Project budget:{" "}
            <span className="font-semibold">
              {getCurrencySymbol((projectFormDetails?.currency as UmojaLinnCurrency) || props?.project?.currency)}
              {formatCurrencyValue((projectFormDetails?.budget as number) || props?.project?.budget) || "0"}
            </span>
          </p>
        </div>
      </div>
      {!!(props?.project?.Gallery?.length || projectFormDetails?.gallery?.length) && (
        <div>
          <h3 className="text-md font-semibold text-foreground mb-2">
            Project Gallery
          </h3>
          <div className="flex flex-row gap-4">
            {/* { id: string; projectId: string; imageUrl: string; title: string; isCoverImage: boolean; } */}
            {/* {props?.project?.Gallery?.map?.((gallery) => ( */}
            <GalleryImages
              images={
                projectFormDetails?.gallery?.length
                  ? projectFormDetails?.gallery.map((gal, i) => ({
                    id: (gal?.id ?? '') as string,
                    projectId: (props.project?.id || '0'),
                    imageUrl: typeof gal.image === 'string'
                      ? gal.image
                      : URL.createObjectURL(gal.image),
                    title: gal?.title,
                    isCoverImage: gal?.isCoverImage,
                    createdAt: props?.project?.Gallery?.[i]?.createdAt ?? '',
                    updatedAt: props?.project?.Gallery?.[i]?.updatedAt ?? ''
                  }))
                  : props?.project?.Gallery ?
                    props.project.Gallery
                    : []}
              // key={gallery?.id}
              width={310}
              height={170}
              // src={gallery.imageUrl}
              // title={gallery?.title}
              wrapperClassName="aspect-video "
            />
            {/* ))} */}
          </div>
        </div>
      )}
      <Collapsible title="Delivery Details">
        <LabelBadge
          title="Country"
          value={projectFormDetails?.country || props?.project?.deliveryAddress?.country}
        />
        <LabelBadge
          title="City"
          value={projectFormDetails?.city || props?.project?.deliveryAddress?.city}
        />
        <LabelBadge
          title="Province / State / Zip code"
          value={[
            projectFormDetails?.state || props?.project?.deliveryAddress?.state,
            projectFormDetails?.zipCode || props?.project?.deliveryAddress?.zipCode,
          ]}
        />
        <LabelBadge
          title="Address"
          value={projectFormDetails?.address || props?.project?.deliveryAddress?.address}
        />
      </Collapsible>
      <Collapsible title="Other Details">
        <LabelBadge
          title="Additional notes"
          value={projectFormDetails?.additionalNotes || props?.project?.additionalNotes}
        />

        <div className="flex items-center justify-between">
          <p className="text-foreground-body text-sm">
            Will buyer provide materials?
          </p>
          <p className={cn("font-semibold",
            (projectFormDetails?.willProvideMaterials || props.project?.willProvideMaterials) ? "text-green-500" : "text-red-600"
          )}>
            {(projectFormDetails?.willProvideMaterials || props.project?.willProvideMaterials) ? "Yes" : "No"}
            {/* {bid.project.willProvideMaterials 
            ? <CheckCircle className="text-success" />
            : <CircleX className="text-white" fill="red" color="currentColor" />
            } */}
          </p>
        </div>

        <LabelBadge
          title="Clothing type"
          value={
            projectFormDetails?.clothingTypes?.map(
              id => allClothingTypes?.find(type => type.id === id)?.name
            ) || props?.project?.clothingTypes?.map?.((type) => type.name)}
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
          disabled={isDesigner}
          onClick={
            !isDesigner
              ? () => router.push(`/designers/${uuidToBase62Safe(props?.project?.designer?.user?.id || "")}`)
              : undefined
          }
          avatar={{
            src: props?.project?.designer?.user?.profilePhotoUri,
          }}
          label={`${props?.project?.designer?.user?.firstName || ""} ${props?.project?.designer?.user?.lastName || ""
            }`}
        />
      </div>
    </>
  );
};

export default ProjectReviewView;
