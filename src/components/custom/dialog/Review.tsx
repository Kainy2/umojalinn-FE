"use client";
import VerifyDialog, { VerifyDialogProps } from "./Verify";
import Alert, { AlertProps } from "../Alert";
import FileUploadPicker from "../picker/FileUpload";
import TextAreaField from "../input/TextAreaField";
import RatingStar from "@/icons/RatingStar";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAddProjectReview } from "@/tanstack/hooks/useProject";
import { cn, jsonToFormData, removeFileFromFileList } from "@/lib/utils";
import { useSession } from "next-auth/react";
import useNewFilePicker from "@/hooks/useNewFilePicker";
import { useState } from "react";

type CustomReviewDialogProps = Partial<VerifyDialogProps> & {
  alert?: AlertProps;
  reviewType?: "EXPERIENCE" | "CLOTHING_QUALITY";
  projectId: string;
  persist?: boolean;
  noOfStars?: number;
};

type ReviewRatingStarsProps = {
  rating: number;
  setRating?: (rating: number) => void;
  disabled?: boolean;
  small?: boolean;
  smallValue?: boolean;
};


export const AverageRatingStars = (props: ReviewRatingStarsProps) => {
  const MAX_RATING = 5;
  const noOfStars = Math.ceil(props.rating);
  const ratingPercent = props.rating / MAX_RATING * 100
  
  // const fraction = (noOfStars - props.rating ) / MAX_RATING * 100;

  return (
    <div className="flex items-center gap-3 w-48">
      <div className="flex relative -ml-0.5">
        <div className="flex">
          {new Array(5).fill(0).map((_, index) => (
            <button key={index} className={"focus:outline-none px-0.5"}>
              <RatingStar
                stroke="#FAC515"
                className={cn(
                  "size-6 text-transparent",
                  props.small && "size-4",
                )}
              />
            </button>
          ))}
        </div>

        <div 
        style={{ width: `${ratingPercent}%` }}
        className="absolute z-10 top-0 left-0 flex overflow-hidden "
        >
          {new Array(noOfStars).fill(0).map((_, index) => (
            <button key={index} className={"focus:outline-none px-0.5"}>
              <RatingStar
                stroke="#FAC515"
                className={cn(
                  "size-6 text-primary-600",
                  props.small && "size-4"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {props.rating != null && (
        <p
          className={cn(
            "font-semibold",
            props.small || props.smallValue ? "text-base" : "text-subtitle-1",
          )}
        >
          {props.rating ? props.rating.toFixed(1) : "0"}
        </p>
      )}
    </div>
  );
};



export const ReviewRatingStars = (props: ReviewRatingStarsProps) => {
  return (
    <div className="flex items-center gap-3 w-48">
      <div className="flex gap-1.5">
        {new Array(5).fill(0).map((_, index) => (
          <button
            key={index}
            className={"focus:outline-none"}
            onClick={() => props.setRating?.(index + 1)}
            disabled={props.disabled}
          >
            <RatingStar
              stroke="#FAC515"
              className={cn(
                "size-6",
                props.small && "size-4",
                index < props.rating ? "text-primary-600" : "text-transparent"
              )}
            />
          </button>
        ))}
      </div>
      {props.rating != null && (
        <p
          className={cn(
            "font-semibold",
            (props.small || props.smallValue) ? "text-base" : "text-subtitle-1",
          )}
        >
          {props.rating ? props.rating.toFixed(1) : "0"}
        </p>
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
    noOfStars,
    ...verifyDialogProps
  } = props;

  const [rating, setRating] = useState<number>(noOfStars ?? 0);
  const [message, setMessage] = useState<string>("");
  const hasFile = reviewType === "CLOTHING_QUALITY";

  // const [images, setImages] = React.useState<FileList | null>(null);
  // const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);
  // const { previewUrls, getPreview } = useImagePreviewUrls();
  //   const { Input, onClick } = useFilePicker({
  //   onSelect: (files) => {
  //     if (!files) return;
  //     const combinedFiles = mergeFiles(images, files);

  //     setImages(combinedFiles);
  //     getPreview(combinedFiles);
  //   },
  //   accept: 'image/*,video/*',
  //   multiple: true,
  // });
  const {
    Input,
    onClick,
    images,
    setImages,
    previewMedia,
    setPreviewMedia,
    isFileSizeValid,
  } = useNewFilePicker();

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
            },
      ),
    );
  };

  const alertComponent = alert && <Alert {...alert} />;

  const fileComponent =
    hasFile &&
    (images && previewMedia?.length ? (
      <div className="flex flex-wrap gap-4">
        {previewMedia.map(({ url, type }, index) => (
          <div key={url} className="relative">
            {type?.includes("video") ? (
              <video
                autoPlay
                muted
                src={url}
                height={150}
                width={150}
                className="object-cover rounded-md"
              />
            ) : (
              <Image
                alt=""
                key={url}
                src={url}
                height={150}
                width={150}
                className="object-cover rounded-md"
              />
            )}
            <button
              onClick={() => {
                setImages((prev) => {
                  if (!prev?.length) return null;
                  const updatedFiles = removeFileFromFileList(prev, index);

                  setPreviewMedia(
                    Array.from(updatedFiles).map((file) => ({
                      type: file.type,
                      url: URL.createObjectURL(file),
                    })),
                  );
                  return updatedFiles;
                });
              }}
              className="bg-error text-white [&>svg]:size-4 p-1.5 rounded-full absolute -left-2 -top-2"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        <button
          onClick={onClick}
          className="h-20 w-20 rounded-full self-center flex items-center justify-center"
        >
          <PlusCircle className="text-primary" />
          <Input />
        </button>
      </div>
    ) : (
      <FileUploadPicker
        multiple
        accept="image/*,video/*"
        onSelect={(files) => {
          const typedFile = files as FileList;
          if (isFileSizeValid(typedFile)) {
            setImages(typedFile);
            setPreviewMedia(
              Array.from(typedFile).map((file) => ({
                type: file.type,
                url: URL.createObjectURL(file),
              })),
            );
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
      pendingConfirm={isAddingProjectReview}
      onConfirm={handleSubmit}
      disableActions={
        isAddingProjectReview || !message?.trim() || !rating
        // || (reviewType === "CLOTHING_QUALITY" && !images)
      }
    />
  );
};

export default ReviewDialog;
