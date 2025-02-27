"use client";
import React from "react";
import VerifyDialog, { VerifyDialogProps } from "./Verify";
import Alert, { AlertProps } from "../Alert";
import FileUploadPicker from "../picker/FileUpload";
import TextAreaField from "../input/TextAreaField";
import RatingStar from "@/icons/RatingStar";
import { useFileSizeError } from "@/hooks/useFilePicker";
import { useImagePreviewUrls } from "@/hooks/useImagePreviewUrls";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useAddProjectReview } from "@/tanstack/hooks/useProject";
import { cn, jsonToFormData } from "@/lib/utils";
import { useSession } from "next-auth/react";

type CustomReviewDialogProps = Partial<VerifyDialogProps> & {
  alert?: AlertProps;
  reviewType?: "EXPERIENCE" | "CLOTHING_QUALITY";
  projectId: string;
  persist?: boolean;
};

type ReviewRatingStarsProps = {
  rating: number;
  setRating?: (rating: number) => void;
  disabled?: boolean;
};

export const ReviewRatingStars = (props: ReviewRatingStarsProps) => {
  return (
    <div className="inline-flex gap-2">
      {new Array(5).fill(0).map((_, index) => (
        <button
          key={index}
          className="focus:outline-none"
          onClick={() => props.setRating?.(index + 1)}
          disabled={props.disabled}
        >
          {
            <RatingStar
              stroke="#FAC515"
              className={cn(
                "w-6 h-6",
                index < props.rating ? "text-primary-600" : "text-transparent"
              )}
            />
          }
        </button>
      ))}
      {props.rating && (
        <p className="text-subtitle-1 font-semibold">{props.rating}.0</p>
      )}
    </div>
  );
};

const ReviewDialog = (props: CustomReviewDialogProps) => {
  const {
    alert,
    reviewType = "EXPERIENCE",
    projectId,
    onOpenChange,
    persist,
    ...verifyDialogProps
  } = props;

  const [rating, setRating] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>("");
  const [images, setImages] = React.useState<File | FileList | null>(null);

  const hasFile = reviewType === "CLOTHING_QUALITY";
  const { isFileSizeValid } = useFileSizeError(1 * 1024 * 1024);
  const { previewUrls, getPreview } = useImagePreviewUrls();
  const { data: session } = useSession();

  const [title, description] =
    reviewType === "EXPERIENCE"
      ? [
          "Experience Feedback",
          `Share your exprience working with this ${
            session?.user?.profileRole === "BUYER" ? "designer" : "client"
          }`,
        ]
      : [
          "Clothing Quality Feedback",
          "Share your feedback on the quality of clothing you made with this Designer",
        ];

  const { mutate: addProjectReview, isPending: isAddingProjectReview } =
    useAddProjectReview(projectId, {
      onSuccess: () => {
        setMessage("");
        setRating(0);
        setImages(null);
        onOpenChange?.(false);
      },
    });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault?.();
    addProjectReview(
      jsonToFormData(
        reviewType === "CLOTHING_QUALITY"
          ? {
              rating,
              message,
              images: images as FileList,
              reviewType,
            }
          : {
              rating,
              message,
              reviewType,
            }
      )
    );
  };

  const alertComponent = alert && <Alert {...alert} />;

  const fileComponent =
    hasFile &&
    (images && previewUrls?.length ? (
      <div className="flex gap-4 relative">
        {previewUrls.map((url) => (
          <Image
            alt=""
            key={url}
            src={url}
            height={150}
            width={150}
            className="object-cover rounded-md"
          />
        ))}
        <button
          onClick={() => setImages?.(null)}
          className="bg-error text-white [&>svg]:size-4 p-1.5 rounded-full absolute -left-2 -top-2"
        >
          <Trash2 />
        </button>
      </div>
    ) : (
      <FileUploadPicker
        multiple
        accept="image/*"
        onSelect={(files) => {
          const typedFile = files as FileList;
          if (isFileSizeValid(typedFile)) {
            setImages(typedFile);
            getPreview(typedFile);
          }
        }}
      />
    ));

  return (
    <VerifyDialog
      onOpenChange={(open) =>
        !isAddingProjectReview || (open && !persist) || !open
          ? onOpenChange?.(open)
          : undefined
      }
      {...{ title, description }}
      {...verifyDialogProps}
      additionalComponent={
        <div className="flex flex-col gap-2">
          {alertComponent}
          <div className="flex justify-center">
            <ReviewRatingStars rating={rating} setRating={setRating} />
          </div>
          <TextAreaField
            label="Description*"
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
          />
          {fileComponent}
        </div>
      }
      onConfirm={handleSubmit}
      disableActions={
        isAddingProjectReview ||
        !message?.trim() ||
        !rating ||
        (reviewType === "CLOTHING_QUALITY" && !images)
      }
    />
  );
};

export default ReviewDialog;
