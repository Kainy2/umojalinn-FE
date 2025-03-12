import Alert from "@/components/custom/Alert";
import ReviewDialog, {
  ReviewRatingStars,
} from "@/components/custom/dialog/Review";
import MilestoneProgress from "@/components/custom/milestone/Progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import { CircleAlert, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type EscrowCardProps = {
  milestones: UmojaLinnMilestone[];
  paidOut: number;
  escrowBalance: number;
  currency?: UmojaLinnProject["currency"];
  projectPrice: number;
  reviews?: UmojaLinnProject["reviews"];
  projectId?: string;
};

const EscrowCard = (props: EscrowCardProps) => {
  const [openExperience, setOpenExperience] = React.useState(false);
  const [openClothingQuality, setOpenClothingQuality] = React.useState(false);

  const { data: session } = useSession();
  const isBuyer = session?.user?.profileRole === "BUYER";
  const isDesigner = session?.user?.profileRole === "DESIGNER";
  const hasDesignerDoneExperience = !!props?.reviews?.find?.(
    (review) => review?.reviewType === "EXPERIENCE" && review?.designerId
  );
  const hasBuyerDoneExperience = !!props?.reviews?.find?.(
    (review) => review?.reviewType === "EXPERIENCE" && review?.buyerId
  );

  const hasBuyerDoneClothingQuality = !!props?.reviews?.find?.(
    (review) => review?.reviewType === "CLOTHING_QUALITY"
  );

  const isIncompleteMilestone = props?.milestones?.find?.(
    (milestone) => milestone?.status !== "APPROVED"
  );

  const hasAllMilestoneCompleted = !isIncompleteMilestone

  return (
    <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-4 py-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-subtitle-2 font-bold">Project Escrow</h2>
        <button>
          <MoreVertical className="text-primary" />
        </button>
      </div>
      <MilestoneProgress
        total={props?.milestones?.length}
        value={
          props?.milestones?.filter?.((milestone) =>
            ["PENDING", "ACTIVE", "IN_REVIEW", "APPROVED"].includes(
              milestone?.status
            )
          )?.length
        }
      />
      <div className="label-grid mb-4">
        <p className="text-md">Paid Out</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.paidOut)}
        </p>
        {props.milestones?.map?.((milestone) => (
          <React.Fragment key={milestone?.id}>
            <p className="truncate">
              {milestone?.title || "Delivery Milestone"}
            </p>
            <p
              className={cn(
                ["FUNDED", "PAID"].includes(milestone?.transactionStatus) &&
                  "line-through"
              )}
            >
              {getCurrencySymbol(props?.currency)}
              {formatCurrencyValue(milestone?.amount)}
            </p>
          </React.Fragment>
        ))}
      </div>
      <div className="label-grid gap-8">
        <p className="text-md">Escrow Balance</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.escrowBalance)}
        </p>
        <p className="text-md">Project Price</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.projectPrice)}
        </p>
      </div>
      <Button variant="outline" fullWidth>
        Invoice
      </Button>
      <div className="flex gap-2 items-center">
        <span className="h-6 w-6 shrink-0 bg-error-100 rounded-full flex items-center justify-center text-error">
          <CircleAlert className="h-4 w-4" />
        </span>
        <span className="text-gray-500 text-xs flex-1">
          Upon milestone approval, funds are deposited into the designer&apos;s
          wallet.
        </span>
      </div>
      {!!props?.reviews?.length && <Separator className="my-4" />}
      <div className="flex flex-col gap-8 text-sm">
        {props.reviews?.map?.((review) => {
          return (
            <div
              key={review?.id}
              className="text-foreground-body flex flex-col gap-2"
            >
              {review?.reviewType === "EXPERIENCE" &&
                ((review?.buyerId && session?.user?.profileRole === "BUYER") ||
                (review?.designerId &&
                  session?.user?.profileRole === "DESIGNER") ? (
                  <p>Your Experience Feedback</p>
                ) : (
                  <div className="">
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src={
                          review?.buyer?.user?.profilePhotoUri ||
                          review?.designer?.user?.profilePhotoUri ||
                          "/img/webp/user.webp"
                        }
                        alt=""
                        height={100}
                        width={100}
                        className="object-cover rounded-full aspect-square shrink-0 size-12"
                      />
                      <h4 className="text-subtitle-2 font-semibold truncate">
                        {(review?.buyer || review?.designer)?.user?.firstName}{" "}
                        {(review?.buyer || review?.designer)?.user?.lastName}
                      </h4>
                    </div>
                    <p>
                      {review?.buyerId && "Client's"}{" "}
                      {review?.designerId && "Designer's"} Experience feedback
                    </p>
                  </div>
                ))}
              {review?.reviewType === "CLOTHING_QUALITY" && (
                <p>Clothing Quality feedback</p>
              )}
              <p className="p-2 bg-white border border-input rounded-sm text-foreground-body">
                {review.message}
              </p>
              <ReviewRatingStars small rating={review.rating || 0} disabled />
              <div className="flex gap-4 overflow-scroll">
                {review.images?.map?.((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt=""
                    height={100}
                    width={100}
                    className="object-cover"
                  />
                ))}
              </div>
            </div>
          );
        })}

        {((isBuyer && !hasBuyerDoneExperience) ||
          (isDesigner && !hasDesignerDoneExperience)) &&
          hasAllMilestoneCompleted && (
            <div className="flex flex-col gap-2  text-foreground-body">
              <p>Your Quality Experience Feedback</p>
              <Alert
                small
                title="Please take note"
                message={
                  isBuyer
                    ? "We kindly request that you provide this review after receiving you order to assist us in enhancing our services to you."
                    : "We kindly request that you provide this review after completing your service to the client."
                }
                type="error"
                icon={<CircleAlert />}
              />
              <ReviewDialog
                reviewType="EXPERIENCE"
                projectId={props.projectId || ""}
                fullWidthActions
                hideCancel
                confirmText="Submit"
                open={openExperience}
                onOpenChange={setOpenExperience}
              >
                <Button fullWidth>Submit Feedback</Button>
              </ReviewDialog>
            </div>
          )}

        {isBuyer && !hasBuyerDoneClothingQuality && hasAllMilestoneCompleted && (
          <div className="flex flex-col gap-2 text-foreground-body">
            <p>Your Clothing Quality Feedback</p>
            <Alert
              title="Please take note"
              message="We kindly request that you provide this review after confirming the product to assist us in enhancing our services to you."
              type="error"
              icon={<CircleAlert />}
              small
            />
            <ReviewDialog
              reviewType="CLOTHING_QUALITY"
              projectId={props.projectId || ""}
              fullWidthActions
              hideCancel
              confirmText="Submit"
              open={openClothingQuality}
              onOpenChange={setOpenClothingQuality}
              alert={{
                title: "Please take note",
                message:
                  "We kindly request that you provide this review after confirming the product to assist us in enhancing our services to you.",
                type: "error",
                icon: <CircleAlert />,
                small: true,
              }}
            >
              <Button fullWidth>Submit Feedback</Button>
            </ReviewDialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowCard;
