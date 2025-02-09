"use client";
import React from "react";
import TextField from "../input/TextField";
import FileUploadPicker from "../picker/FileUpload";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
import { useImagePreviewUrls } from "@/hooks/useImagePreviewUrls";
import Image from "next/image";
import { Link2, Locate, Trash2 } from "lucide-react";
import {
  UmojaLinnDeliveryMilestoneReviewProps,
  UmojaLinnMilestone,
} from "@/types/project";
import TextAreaField from "../input/TextAreaField";
import CustomSelectCountry from "../SelectCountry";
import { useGetMilestoneSubmissions } from "@/tanstack/hooks/useProject";

type MilestoneInputSectionProps = {
  id?: string;
  isBuyer?: boolean;
  isDesigner?: boolean;
  onMessageChange?: (message: string) => void;
  onFilesChange?: (files: FileList | null) => void;
  message?: string;
  files?: FileList | null;
  status?: MilestoneTimelineItem["status"];
  isDeliveryMilestone?: boolean;
  deliveryMethod?: UmojaLinnMilestone["deliveryMethod"];
  deliveryDetails?: UmojaLinnDeliveryMilestoneReviewProps;
  editedDeliveryDetails?: UmojaLinnDeliveryMilestoneReviewProps;
  onChangeDeliveryDetails?: (
    props: Partial<UmojaLinnDeliveryMilestoneReviewProps>
  ) => void;
};

const MilestoneInputSectionImageUpload = (
  props: Pick<MilestoneInputSectionProps, "files" | "onFilesChange"> & {
    disabled?: boolean;
  }
) => {
  const { previewUrls, getPreview } = useImagePreviewUrls();

  return props?.files && previewUrls?.length ? (
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
        onClick={() => props?.onFilesChange?.(null)}
        className="bg-error text-white [&>svg]:size-4 p-1.5 rounded-full absolute -left-2 -top-2"
      >
        <Trash2 />
      </button>
    </div>
  ) : (
    <FileUploadPicker
      cta="Click to Upload"
      details="or drag and drop"
      multiple
      onSelect={(files) => {
        console.log(files);
        if (files && files instanceof FileList) {
          props?.onFilesChange?.(files);
          getPreview(files);
        }
      }}
    />
  );
};

const MilestoneInputSection = (props: MilestoneInputSectionProps) => {
  const { data: milestoneSubmissions } = useGetMilestoneSubmissions(props.id);

  const deliverySubmissions = milestoneSubmissions?.data?.data;

  const lastSubmission =
    deliverySubmissions?.length &&
    deliverySubmissions?.[deliverySubmissions?.length - 1];

  const { editedDeliveryDetails } = props;

  if (props.isDeliveryMilestone && props?.status === MilestoneStatus.ACTIVE) {
    const isDeliveryMilestoneEditable =
      props.status &&
      props.status === MilestoneStatus.ACTIVE &&
      props.isDesigner;

    const {
      description,
      media,
      city,
      country,
      courierService,
      courierServiceLink,
      state,
      street,
      trackingId,
      zipCode,
    } =
      (isDeliveryMilestoneEditable ? editedDeliveryDetails : lastSubmission) ||
      {};

    const handleChange =
      (prop: keyof UmojaLinnDeliveryMilestoneReviewProps) =>
      (
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLTextAreaElement>
      ) => {
        props?.onChangeDeliveryDetails?.({
          [prop]: e?.target?.value,
        });
      };

    const imagePicker = (
      <MilestoneInputSectionImageUpload
        disabled={!isDeliveryMilestoneEditable}
        files={media as FileList | undefined}
        onFilesChange={(files) =>
          props?.onChangeDeliveryDetails?.({ media: files })
        }
      />
    );

    switch (props?.deliveryMethod) {
      case "NON_TRACKED":
        return (
          <>
            <TextField
              onChange={handleChange("courierService")}
              value={courierService || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Select courier service"
            />
            <TextAreaField
              onChange={handleChange("description")}
              value={description || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Enter any other information"
            />
            {imagePicker}
          </>
        );
      case "TRACKED":
        return (
          <>
            <TextField
              onChange={handleChange("courierService")}
              value={courierService || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Select courier service"
            />
            <TextField
              onChange={handleChange("courierServiceLink")}
              value={courierServiceLink || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Tracking link"
              startAdornment={<Link2 className="size-5 text-gray-600" />}
            />
            <TextField
              onChange={handleChange("trackingId")}
              value={trackingId || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Tracking id"
              startAdornment={<Locate className="size-5 text-gray-600" />}
            />
            <TextAreaField
              onChange={handleChange("description")}
              value={description || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Enter any other information"
            />
            {imagePicker}
          </>
        );
      case "IN_PERSON_PICKUP":
      default:
        return (
          <>
            <CustomSelectCountry
              onValueChange={(val) => {
                props?.onChangeDeliveryDetails?.({
                  country: val,
                });
              }}
              value={country || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Country"
            />
            <TextField
              onChange={handleChange("state")}
              value={state || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="State/Province"
            />
            <TextField
              onChange={handleChange("city")}
              value={city || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="City"
            />
            <TextField
              onChange={handleChange("zipCode")}
              value={zipCode || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Zip/Postal Code"
            />
            <TextAreaField
              onChange={handleChange("street")}
              value={street || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Street/Apartment/Suite"
            />
            {imagePicker}
          </>
        );
    }
  }

  if (props?.status === MilestoneStatus.ACTIVE && props?.isDesigner) {
    return (
      <div className="flex flex-col gap-4">
        <TextField
          value={props?.message}
          onChange={(e) => props?.onMessageChange?.(e.target.value)}
        />
        <MilestoneInputSectionImageUpload {...props} />
      </div>
    );
  }
};

export default MilestoneInputSection;
