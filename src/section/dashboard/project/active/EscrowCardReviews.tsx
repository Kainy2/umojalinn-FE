import React, { useMemo } from 'react'
import Alert from "@/components/custom/Alert";
import ReviewDialog, {
  ReviewRatingStars,
} from "@/components/custom/dialog/Review";
import GalleryImages from "@/components/custom/GalleryImages";
import { Button } from "@/components/ui/button";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import { EDeliveryMileStoneType, EMileStoneStatus } from "@/types/enum";
import { CircleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn, isVideoLink } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';


type EscrowReviewProps = {
  reviews: UmojaLinnProject["reviews"];
  projectId?: string;
  project?: UmojaLinnProject;
	milestones: UmojaLinnMilestone[];
};

const isDeliveryMilestone = (milestone: UmojaLinnMilestone) =>
	!!milestone.deliveryMethod ||
	milestone.deliveryMileStoneType === EDeliveryMileStoneType.VARIABLE;

/** Approved milestones, or refunded delivery milestones, count as complete for review prompts. */
const isMilestoneCompleteForReview = (milestone: UmojaLinnMilestone) =>
	milestone.status === EMileStoneStatus.APPROVED ||
	(milestone.status === EMileStoneStatus.REFUNDED &&
		isDeliveryMilestone(milestone));

const EscrowCardReviews = (props: EscrowReviewProps) => {
		const searchParams = useSearchParams();
		const shouldWriteReviews =
			searchParams.get("shouldWriteReviews") === "true"; // boolean
		const isExperienceFeedback =
			searchParams.get("isExperienceFeedback") === "true"; // boolean
		const noOfStars = searchParams.get("noOfStars")
			? Number(searchParams.get("noOfStars"))
			: undefined; // number or undefined

		const { data: session } = useSession();
		const [openExperience, setOpenExperience] = React.useState(
			(shouldWriteReviews && isExperienceFeedback)
		);
		const [openClothingQuality, setOpenClothingQuality] = React.useState(
			(shouldWriteReviews && !isExperienceFeedback)
		);

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
	
		const hasAllMilestoneCompleted =
			props.milestones?.every(isMilestoneCompleteForReview) ?? false;
		const allReviews = useMemo(() => 
			props.reviews?.filter(review=>{
			const isDesigner = session?.user?.profileRole === "DESIGNER";
			if (isDesigner && review?.buyerId && !props?.project?.showDesignerReviews) return false;
			if (!isDesigner && review?.designerId && !props?.project?.showBuyerReviews) return false;
			return true
		}),[
			props.reviews,
			session?.user?.profileRole,
			props?.project?.showDesignerReviews,
			props?.project?.showBuyerReviews,
		]);

	return (
			<div className={cn(
				"flex flex-col gap-8 text-sm md:mt-0",
				(allReviews?.length || hasAllMilestoneCompleted) && "mt-16"
			)}>
				{allReviews?.map?.((review) => (
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
											src={review?.buyer?.user?.profilePhotoUri ||
												review?.designer?.user?.profilePhotoUri ||
												"/img/webp/user.webp"}
											alt=""
											height={100}
											width={100}
											className="object-cover rounded-full aspect-square shrink-0 size-12" />
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
							<>
								{/* <Image
            key={image}
            src={image}
            alt=""
            height={100}
            width={100}
            className="object-cover"
        /> */}
								{/* {review.images?.map?.((image, i) => (
            <Dialog key={image}>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        "relative w-28 h-28 rounded-md overflow-hidden"
                    )}
                >
                    <Image
                        alt={`Review-${i}`}
                        src={image}
                        className="shrink-0 object-cover absolute"
                        fill
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="h-full w-full max-w-[80vw] max-h-[80vh] p-0 border-0 bg-black/50 [&>button>svg]:text-white overflow-hidden">
                <div className="relative">
                    <DialogTitle className="hidden">
                        Image
                    </DialogTitle>
                    <Image
                        src={image}
                        className="shrink-0 object-contain absolute"
                        fill
                        alt={`Review-${i}`}
                    />
                </div>
            </DialogContent>
        </Dialog>
        ))} */}
							</>


							<GalleryImages
								height={100}
								width={100}
								images={review.images?.map?.((image, i) => ({
									imageUrl: image,
									// title: `Review-${i}`,
									type: isVideoLink(image) ? "video" : "image",
									id: `Review-${i}`,
								}))} />
						</div>
					</div>
				))}

				{((isBuyer && !hasBuyerDoneExperience) ||
					(isDesigner && !hasDesignerDoneExperience)) &&
					hasAllMilestoneCompleted && (
						<div className="flex flex-col gap-2 text-foreground-body">
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
								noOfStars={(shouldWriteReviews && isExperienceFeedback) ? noOfStars : undefined}
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
								noOfStars={(shouldWriteReviews && !isExperienceFeedback) ? noOfStars : undefined}
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
	)
}

export default EscrowCardReviews