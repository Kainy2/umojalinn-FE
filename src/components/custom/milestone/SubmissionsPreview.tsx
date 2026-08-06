import { useGetMilestoneSubmissions } from "@/tanstack/hooks/useProject";

import { UmojaLinnUser } from "@/types/user";
import Image from "next/image";
import React from "react";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
import { cn, isVideoLink } from "@/lib/utils";
// import { Link2, Locate, MapPin, Truck } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import GalleryImages from "../GalleryImages";
import { DeliveryDetails, EmptyDeliveryDetails } from "./DeliveryDetails";
import { UmojaLinnMilestone } from "@/types/project";
import Link from "next/link";
import { uuidToBase62Safe } from "@/lib/uuid";

type MilestoneSubmissionsPreviewProps = {
  milestoneId: string;
  isFixedDelivery: boolean;
  deliveryMethod?: UmojaLinnMilestone["deliveryMethod"];
  isDeliveryMilestone?: boolean;
  isDesigner?: boolean;
  status?: MilestoneTimelineItem["status"];
  designer: UmojaLinnUser | null | undefined;
  buyer: UmojaLinnUser | null | undefined;
};

type MilestoneSubmissionsPreviewUserProps = {
  user?: UmojaLinnUser | null;
  isMe?: boolean;
};

const MilestoneSubmissionsPreviewUser = (
  props: MilestoneSubmissionsPreviewUserProps,
) => {
  return (
    <Link
      className="w-fit"
      href={
        props.user?.buyerProfile?.id
          ? "/settings/profile"
          : `/designers/${uuidToBase62Safe(props.user?.designerProfile?.userId || "")}`
      }
    >
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src={props?.user?.profilePhotoUri || "/img/webp/user.webp"}
          height={25}
          width={25}
          className="rounded-full shrink-0 relative"
        />
        <h5 className="whitespace-nowrap truncate font-semibold">
          {props?.isMe
            ? "You"
            : `${props?.user?.firstName || ""} ${props?.user?.lastName || ""}`}
        </h5>
      </div>
    </Link>
  );
};


const MilestoneSubmissionsPreview = (
  props: MilestoneSubmissionsPreviewProps,
) => {
  const { 
    milestoneId, 
    isFixedDelivery,
    isDeliveryMilestone,
    isDesigner,
    status,
    deliveryMethod,
   } = props;

  const { data: milestoneSubmissionsData } =
    useGetMilestoneSubmissions(milestoneId);

  const milestoneSubmissions = milestoneSubmissionsData?.data?.data;
  const isAwaitingFunding = status === MilestoneStatus.AWAITING_FUND
  const isMilestoneActive = status === MilestoneStatus.ACTIVE
  const isMilestoneInactive = status === MilestoneStatus.INACTIVE 

  // Show empty delivery details section to designer when designer is not yet in filling form stage
  if (isFixedDelivery && isDeliveryMilestone && isDesigner && (isMilestoneInactive || isAwaitingFunding))
    return (
    <div className={cn("rounded-md border border-gray-300 bg-gray-50 py-2.5 px-5 md:py-5",
      isMilestoneInactive && "opacity-50"
    )}>
      <EmptyDeliveryDetails currentDeliveryMethod={deliveryMethod} />
    </div>
  )

  // Show awaiting delivery to buyer when designer is in filling form stage
  if (isFixedDelivery && isDeliveryMilestone && !isDesigner && isMilestoneActive && !milestoneSubmissions?.length ) return (
    <div className="rounded-md border border-gray-300 bg-gray-50 py-2.5 px-5 md:py-5">
      <DeliveryDetails deliveryMethod={deliveryMethod} />
    </div>
  )

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-4",
        props?.status === MilestoneStatus.INACTIVE
          ? "text-muted-foreground"
          : "text-foreground-body",
      )}
    >
      {milestoneSubmissions?.map((submission) => {
        // const {
        //   street,
        //   state,
        //   city,
        //   country,
        //   courierService,
        //   courierServiceLink,
        //   trackingId,
        //   zipCode
        // } = submission;
        // const address = [street, state, city, country]
        //   .filter((place) => place)
        //   .join(" ,");
        return (
          <div key={submission?.id} className="flex flex-col gap-2">
            <MilestoneSubmissionsPreviewUser
              user={props.designer}
              isMe={props.isDesigner}
            />
            {!props.isDeliveryMilestone && <p className=" text-sm">{submission.description}</p>}

            {props.isDeliveryMilestone && (
              <div className="rounded-md border border-gray-300 bg-gray-50 py-2.5 px-5 md:py-5">
                <DeliveryDetails
                  deliveryMethod={props.deliveryMethod}
                  submission={submission}
                />
              </div>
            )}
            <>
              {/* <div className="flex flex-wrap gap-2">
                {[
                  {
                    icon: <MapPin />,
                    value: address,
                  },
                  {
                    icon: <MapPin />,
                    value: zipCode,
                  },
                  {
                    icon: <Truck />,
                    value: courierService,
                  },
                  {
                    icon: <Link2 />,
                    value: courierServiceLink,
                    link: true,
                  },
                  {
                    icon: <Locate />,
                    value: trackingId,
                  },
                ]
                  .filter(({ value }) => value)
                  .map(({ value, icon, link }) => {
                    const Comp: React.ElementType = link ? "a" : "span";
                    return (
                      <Comp
                        href={normaliseLink(value)}
                        target="_blank"
                        className="flex gap-2 border border-gray-300  rounded-full [&>svg]:size-5 text-sm px-2 py-1 items-center leading-none text-foreground-body"
                        key={value}
                      >
                        {icon} {value}
                      </Comp>
                    );
                  })}
              </div> */}
            </>
            <div className="flex gap-2">
              <GalleryImages
                height={100}
                width={100}
                images={submission.images?.map?.((image, i) => ({
                  imageUrl: image.url,
                  // title: image.meta.fileName,
                  type: isVideoLink(image.url) ? "video" : "image",
                  id: `Review-${i}`,
                }))}
              />
            </div>
            {!!submission.rejectionReason && (
              <>
                <MilestoneSubmissionsPreviewUser
                  user={props.buyer}
                  isMe={!props.isDesigner}
                />
                <p className="text-sm">{submission.rejectionReason}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneSubmissionsPreview;
