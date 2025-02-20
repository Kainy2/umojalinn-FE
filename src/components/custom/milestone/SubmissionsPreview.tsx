import { useGetMilestoneSubmissions } from "@/tanstack/hooks/useProject";

import { UmojaLinnUser } from "@/types/user";
import Image from "next/image";
import React from "react";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
import { cn } from "@/lib/utils";
import { Link2, Locate, MapPin, Truck } from "lucide-react";

type MilestoneSubmissionsPreviewProps = {
  milestoneId: string;
  isBuyer?: boolean;
  isDesigner?: boolean;
  status?: MilestoneTimelineItem["status"];
};

type MilestoneSubmissionsPreviewUserProps = {
  user?: UmojaLinnUser;
  isMe?: boolean;
};

const MilestoneSubmissionsPreviewUser = (
  props: MilestoneSubmissionsPreviewUserProps
) => {
  return (
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
  );
};

const MilestoneSubmissionsPreview = (
  props: MilestoneSubmissionsPreviewProps
) => {
  const { milestoneId } = props;
  const { data: milestoneSubmissionsData } =
    useGetMilestoneSubmissions(milestoneId);

  const milestoneSubmissions = milestoneSubmissionsData?.data?.data;
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-4",
        props?.status === MilestoneStatus.INACTIVE
          ? "text-muted-foreground"
          : "text-foreground-body"
      )}
    >
      {milestoneSubmissions?.map((submission) => {
        const {
          street,
          state,
          city,
          country,
          courierService,
          courierServiceLink,
          trackingId,
        } = submission;
        const address = [street, state, city, country]
          .filter((place) => place)
          .join(" ,");
        return (
          <div key={submission?.id} className="flex flex-col gap-2">
            <MilestoneSubmissionsPreviewUser
              user={submission.milestone?.project?.designer?.user}
              isMe={props?.isDesigner}
            />
            <p className=" text-sm">{submission.description}</p>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  icon: <MapPin />,
                  value: address,
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
                      href={value}
                      target="_blank"
                      className="flex gap-2 border border-gray-300  rounded-full [&>svg]:size-5 text-sm px-2 py-1 items-center leading-none text-foreground-body"
                      key={value}
                    >
                      {icon} {value}
                    </Comp>
                  );
                })}
            </div>
            <div className="flex gap-2">
              {submission.images?.map((file, index) => (
                <Image
                  key={file + index}
                  alt=""
                  src={file}
                  height={100}
                  width={100}
                  className="rounded-md object-cover"
                />
              ))}
            </div>
            {!!submission.rejectionReason && (
              <>
                <MilestoneSubmissionsPreviewUser
                  user={submission.milestone?.project?.buyer?.user}
                  isMe={props?.isBuyer}
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
