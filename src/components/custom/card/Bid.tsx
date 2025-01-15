import { formatNumberTo2DecimalPlace } from "@/lib/number";
import { capitalizeFirstLetter } from "@/lib/string";
import { cn } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import { UmojaLinnBid } from "@/types/project";
import { format } from "date-fns";
import { EyeOff, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type BidCardProps = {
  disabled?: boolean;
  bid: UmojaLinnBid;
};

export const BidCardFooterValues = (props: {
  value?: string | null | number;
  label: string | null;
}) => {
  return (
    <p>
      {props.value || "None"}{" "}
      <span className="font-normal text-gray-400 hidden lg:inline">
        {props.label}
      </span>
    </p>
  );
};

const BidCard = (props: BidCardProps) => {
  return (
    <Link
      href={`/bids/${uuidToBase62Safe(props.bid?.id || "")}`}
      className={cn(
        "relative py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        props.disabled && "text-gray-400 pointer-events-none cursor-not-allowed"
      )}
    >
      <EyeOff className="absolute size-5 top-6 right-0" />
      <div className="flex gap-4 items-center mb-4">
        <div
          className={cn(
            "relative w-14 h-14 border-2 border-white shadow-md shadow-gray-950/15 rounded-full overflow-hidden [&>svg]:size-6",
            !props.bid?.designer?.user?.profilePhotoUri &&
              "flex items-center justify-center"
          )}
        >
          {props.bid?.designer?.user?.profilePhotoUri ? (
            <Image
              fill
              className="object-cover"
              alt=""
              src={props.bid?.designer?.user?.profilePhotoUri}
            />
          ) : (
            <User />
          )}
        </div>
        <div>
          <h3 className="text-subtitle-2">
            {props.bid?.designer?.user?.firstName}{" "}
            {props.bid?.designer?.user?.lastName}
          </h3>
          <p>
            {props.bid?.designer?.user?.address?.country}
            {" • "}
            <span className="text-gray-400">Sent</span>{" "}
            <span className="font-medium">
              {format(props.bid?.createdAt, "dd MMM, yyyy")}
            </span>
          </p>
        </div>
      </div>
      <p className="mb-4">{props.bid?.additionalNotesToClient}</p>
      <div className="flex p-3 font-semibold justify-between items-center bg-gray-50">
        <BidCardFooterValues
          value={props.bid?.project?.title}
          label="Project"
        />
        <BidCardFooterValues
          value={props.bid?.milestones?.length || 0}
          label="Milestones"
        />
        <BidCardFooterValues
          value={
            !props.bid?.project?.budget ||
            !props.bid?.amount ||
            typeof props.bid?.project?.budget !== "number"
              ? "None"
              : `${formatNumberTo2DecimalPlace(
                  (props.bid?.project?.budget / props.bid?.amount) * 100
                )}%`
          }
          label="Budget"
        />
        <BidCardFooterValues
          value={capitalizeFirstLetter(
            props.bid?.deliveryMilestone?.deliveryMethod || "None"
          )}
          label="Delivery Method"
        />
      </div>
    </Link>
  );
};

export default BidCard;
