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

const MilestoneInputSection = (props: MilestoneInputSectionProps) => {
  const { previewUrls, getPreview } = useImagePreviewUrls();
  const { data: milestoneSubmissions, isPending: loadingMilestoneSubmissions } =
    useGetMilestoneSubmissions(props.id);

  const deliverySubmissions = milestoneSubmissions?.data?.data;

  const lastSubmission =
    deliverySubmissions?.length &&
    deliverySubmissions?.[deliverySubmissions?.length - 1];

  const { editedDeliveryDetails } = props;

  if (props.isDeliveryMilestone && !loadingMilestoneSubmissions) {
    const isDeliveryMilestoneEditable =
      props.status &&
      props.status === MilestoneStatus.ACTIVE &&
      props.isDesigner;

    const {
      description,
      // media,
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

    switch (props.deliveryMethod) {
      case "NON_TRACKED":
        return (
          <>
            <TextField
              value={courierService || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Select courier service"
            />
            <TextAreaField
              value={description || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Enter any other information"
            />
          </>
        );
      case "TRACKED":
        return (
          <>
            <TextField
              value={courierService || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Select courier service"
            />
            <TextField
              value={courierServiceLink || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Tracking link"
              startAdornment={<Link2 className="size-5 text-gray-600" />}
            />
            <TextField
              value={trackingId || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Tracking id"
              startAdornment={<Locate className="size-5 text-gray-600" />}
            />
            <TextAreaField
              value={description || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Enter any other information"
            />
          </>
        );
      case "IN_PERSON_PICKUP":
      default:
        return (
          <>
            <CustomSelectCountry
              value={country || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Country"
            />
            <TextField
              value={state || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="State/Province"
            />
            <TextField
              value={city || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="City"
            />
            <TextField
              value={zipCode || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Zip/Postal Code"
            />
            <TextAreaField
              value={street || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Street/Apartment/Suite"
            />
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
        {props?.files && previewUrls?.length ? (
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
        )}
      </div>
    );
  }
};

export default MilestoneInputSection;
