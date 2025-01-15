import { getCurrencySymbol } from "@/lib/string";
import { uuidToBase62Safe } from "@/lib/uuid";
import { UmojaLinnProject } from "@/types/project";
import { CircleDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as timeago from "timeago.js";
import { BidCardFooterValues } from "./Bid";

const AdCard = (props: { project: UmojaLinnProject }) => {
  return (
    <Link
      href={`/jobs/${uuidToBase62Safe(props.project?.id)}`}
      className="flex flex-col gap-4 items-stretch lg:flex-row border-2 border-gray-100 rounded-sm p-4"
    >
      <div className="lg:hidden flex gap-2 items-center">
        <Image
          height={40}
          width={40}
          alt=""
          src={
            props.project?.buyer?.user?.profilePhotoUri || "/img/webp/user.webp"
          }
          className="object-cover rounded-full"
        />
        <div>
          <h3 className="text-subtitle-2 mb-1 font-semibold">
            {props.project?.title}
          </h3>
          <p className="text-foreground-body text-sm">
            Posted about {timeago.format(props.project?.updatedAt)}
          </p>
        </div>
      </div>
      <div className="relative h-36 shrink-0 w-full  lg:size-52 ">
        <Image
          fill
          alt=""
          src={
            props.project?.Gallery?.find((gallery) => gallery.isCoverImage)
              ?.imageUrl || "/img/svg/null.svg"
          }
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="hidden lg:flex gap-2 items-center">
          <Image
            height={40}
            width={40}
            alt=""
            src={
              props.project?.buyer?.user?.profilePhotoUri ||
              "/img/webp/user.webp"
            }
            className="object-cover rounded-full"
          />
          <h3 className="text-subtitle-2 font-semibold">
            {props.project?.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 [&>svg]:size-6 [&>svg]:text-gray-300">
          <p className="bg-gray-100 p-2 py-1 text-foreground-body text-sm rounded-full flex items-center gap-1 before:content-[''] before:size-2 before:block before:bg-gray-500 before:rounded-full ">
            {[
              props.project?.deliveryAddress?.state,
              props.project?.deliveryAddress?.country,
            ]
              .filter((loc) => !!loc)
              .join(", ")}
          </p>
          <CircleDollarSign />
          <p>
            {getCurrencySymbol(props.project?.currency)}
            {props.project?.budget || 0}
          </p>
        </div>

        <p className="text-foreground-body flex-1 h-full truncate line-clamp-4">
          {props.project?.about}
        </p>
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-6">
            <BidCardFooterValues
              label="Wear"
              value={props?.project?.gender === "MALE" ? "Men's" : "Women's"}
            />
            {/* <BidCardFooterValues label="Experience" value={""} />
            <BidCardFooterValues label="Language" value={""} /> */}
          </div>
          <span className="text-foreground-body hidden lg:block">
            Posted about {timeago.format(props.project?.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;
