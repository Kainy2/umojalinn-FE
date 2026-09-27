import { InvoiceButton } from "@/components/custom/Invoice";
import MilestoneProgress from "@/components/custom/milestone/Progress";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import { EMileStoneStatus } from "@/types/enum";
import { CircleAlert, MoreVertical } from "lucide-react";
import React, { useMemo } from "react";
import EscrowCardReviews from "./EscrowCardReviews";
import { Separator } from "@radix-ui/react-select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "next-auth/react";

type EscrowCardProps = {
  milestones: UmojaLinnMilestone[];
  escrowBalance: number;
  currency?: UmojaLinnProject["currency"];
  projectPrice: number;
  reviews?: UmojaLinnProject["reviews"];
  projectId?: string;
  project?: UmojaLinnProject;
};

const EscrowCard = (props: EscrowCardProps) => {
  const { data: me } = useSession();
  const isDesigner = me?.user?.profileRole === "DESIGNER";
  const isDesktop = useMediaQuery("md");
  const totalReleased = useMemo(
    () =>
      props?.milestones?.reduce?.((acc, milestone) => {
        if (milestone?.transactionStatus !== "PAID") return acc;
        return acc + (Number(milestone?.amount) ?? 0);
      }, 0),
    [props?.milestones],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-gray-50 rounded-md p-4 py-8 md:min-w-80",
        // !hasAllMilestoneCompleted && "hidden lg:flex"
      )}
      id="tour-active-project-escrow"
    >
      <div className="">
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
                milestone?.status,
              ),
            )?.length
          }
        />
        <div className="label-grid mb-4">
          <p className="text-md">Released</p>
          <p className="text-md font-semibold">
            {getCurrencySymbol(props?.currency)}
            {formatCurrencyValue(totalReleased)}
          </p>
          {props.milestones?.map?.((milestone) => (
            <React.Fragment key={milestone?.id}>
              <p className="truncate">
                {milestone?.title || "Delivery Milestone"}
              </p>
              <p
                className={cn(
                  (milestone?.transactionStatus === "PAID" ||
                    milestone?.status === EMileStoneStatus.REFUNDED) &&
                    "line-through",
                )}
              >
                {getCurrencySymbol(props?.currency)}
                {formatCurrencyValue(Number(milestone?.amount))}
              </p>
            </React.Fragment>
          ))}
        </div>
        <div className="label-grid gap-8">
          <p className="text-md">Escrow Balance</p>
          <p className="text-md font-semibold">
            {getCurrencySymbol(props?.currency)}
            {formatCurrencyValue(Number(props.escrowBalance))}
          </p>
          <p className="text-md">Project Price</p>
          <p className="text-md font-semibold">
            {getCurrencySymbol(props?.currency)}
            {formatCurrencyValue(Number(props.projectPrice))}
          </p>
        </div>
        <InvoiceButton
          project={props.project}
          milestones={props.milestones}
          isDesigner={isDesigner}
        />
        <div className="flex gap-2 items-center mt-2">
          <span className="h-6 w-6 shrink-0 bg-error-100 rounded-full flex items-center justify-center text-error">
            <CircleAlert className="h-4 w-4" />
          </span>
          <span className="text-gray-500 text-xs flex-1">
            Upon milestone approval, funds are deposited into the
            designer&apos;s wallet.
          </span>
        </div>
      </div>

      {isDesktop && (
        <div className="md:block hidden">
          {!!props?.reviews?.length && <Separator className="my-4" />}

          <EscrowCardReviews
            reviews={props.reviews || []}
            projectId={props.projectId}
            project={props.project}
            milestones={props.milestones}
          />
        </div>
      )}
    </div>
  );
};

export default EscrowCard;

{
  /*


                <GalleryImages
                  height={100}
                  width={100}
                  images={review.images?.map?.((image, i) => ({
                    imageUrl: image,
                    // title: `Review-${i}`,
                    id: `Review-${i}`,
                  }))}
                />
              </div>
            </div>
          );
        })}

        {((isBuyer && !hasBuyerDoneExperience) ||
          (isDesigner && !hasDesignerDoneExperience)) &&
          hasAllMilestoneCompleted && (
            <div className="flex flex-col gap-2  text-foreground-body">
              <p>Your Experience Feedback</p>
              <Alert
                small
                title="Please take note"
                message={
                  isBuyer
                    ? "We kindly request that you share how your experience was working with this designer."
                    : "We kindly request that you share how your experience was working with this client."
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

        {isBuyer &&
          !hasBuyerDoneClothingQuality &&
          hasAllMilestoneCompleted && (
            <div className="flex flex-col gap-2 text-foreground-body">
              <p>Your Clothing Quality Feedback</p>
              <Alert
                title="Please take note"
                message="We kindly request that you provide this review after receiving your order to assist us in enhancing our services to you."
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
                    "We kindly request that you provide this review after receiving your order to assist us in enhancing our services to you.",
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

*/
}
