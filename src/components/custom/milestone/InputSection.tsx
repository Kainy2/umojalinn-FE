"use client";
import React from "react";
import TextField from "../input/TextField";
import FileUploadPicker from "../picker/FileUpload";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
// import { useImagePreviewUrls } from "@/hooks/useImagePreviewUrls";
import Image from "next/image";
import { Link2, Locate, PlusCircle, Trash2 } from "lucide-react";
import {
  UmojaLinnDeliveryMilestoneReviewProps,
  UmojaLinnMilestone,
} from "@/types/project";
import TextAreaField from "../input/TextAreaField";
import CustomSelectCountry from "../SelectCountry";
import { useGetMilestoneSubmissions } from "@/tanstack/hooks/useProject";
import { Textarea } from "@/components/ui/textarea";
import {  removeFileFromFileList } from "@/lib/utils";
import useNewFilePicker from "@/hooks/useNewFilePicker";

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
  
  // const [previewMedia, setPreviewMedia] = useState<{type: string, url: string}[]>([]);
  
  // const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);
  // // const { previewUrls, getPreview } = useImagePreviewUrls();
  // const { Input, onClick } = useFilePicker({
  //   onSelect: (files) => {
  //     if (!files) return;
  //     if (!isFileSizeValid(files)) return;
  //     const combinedFiles = mergeFiles(props?.files, files);

  //     props?.onFilesChange?.(combinedFiles);
  //     setPreviewMedia(
  //       Array.from(combinedFiles).map((file) => ({
  //         type: file.type,
  //         url: URL.createObjectURL(file),
  //       }))
  //     );
  //   },
  //   accept: 'image/*,video/*',
  //   multiple: true,
  // });

    const { 
    Input, 
    onClick, 
    previewMedia,
    setPreviewMedia,
    isFileSizeValid
  } = useNewFilePicker({
    onSelect:(combinedFiles) => {
      props?.onFilesChange?.(combinedFiles);
    },
  })

  if (props?.files?.length) {
    return (
      <div className="flex flex-wrap gap-4 relative items-start ">
        {previewMedia?.map(({type, url}, index) => (
          <div
            key={url}
            className="relative  border border-gray-100"
          >
            <button
              className="bg-error text-white [&>svg]:size-4 p-1.5 rounded-full absolute -left-2 -top-2"
              onClick={() => {
                if (!props?.files) return;
                const updatedFiles = removeFileFromFileList(props.files, index);

                props?.onFilesChange?.(updatedFiles);
                setPreviewMedia(
                  Array.from(updatedFiles).map((file) => ({
                    type: file.type,
                    url: URL.createObjectURL(file),
                  }))
                );
              } }
            >
              <Trash2 />
            </button>

            {type.includes("video") ? (
              <video
                height={50}
                width={50}
                src={url}
                className="size-14 object-cover rounded"
              />
            ) : (
              <Image
                alt=""
                src={url}
                height={150}
                width={150}
                className="object-contain rounded-md"
              />
            )}
          </div>
        ))}
      <button 
       onClick={onClick}
       className="h-20 w-20 rounded-full self-center flex items-center justify-center">
        <PlusCircle className="text-primary" />
        <Input/>
      </button>
      </div>
    );
  }

  return (
    <FileUploadPicker
      cta="Click to Upload"
      details="or drag and drop"
      accept="image/*,video/*"
      multiple
      onSelect={(files) => {
        if (files && files instanceof FileList) {
          if (!isFileSizeValid(files)) return;

          props?.onFilesChange?.(files);
          setPreviewMedia(
            Array.from(files).map((file) => ({
              type: file.type,
              url: URL.createObjectURL(file),
            }))
          );
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
      props.status === MilestoneStatus.ACTIVE && props.isDesigner;

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

    const imagePicker = isDeliveryMilestoneEditable && (
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
              placeholder="Courier Name e.g. DHL"
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
              placeholder="Courier Name e.g. DHL"
            />
            <TextField
              onChange={handleChange("courierServiceLink")}
              value={courierServiceLink || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Tracking Link or Courier Website e.g. www.dhl.com"
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
              onChange={(val: unknown) => {
                const typedVal = val as { value: string };
                props?.onChangeDeliveryDetails?.({
                  country: typedVal?.value,
                });
              }}
              value={country || ""}
              isDisabled={!isDeliveryMilestoneEditable}
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
            <TextAreaField
              onChange={handleChange("description")}
              value={description || ""}
              disabled={!isDeliveryMilestoneEditable}
              placeholder="Enter any other information"
            />
            {imagePicker}
          </>
        );
    }
  }

  if (props?.status === MilestoneStatus.ACTIVE && props?.isDesigner) {
    return (
      <div className="flex flex-col gap-4">
        <Textarea
          className="min-h-[48px]"
          value={props?.message}
          onChange={(e) => props?.onMessageChange?.(e.target.value)}
        />
        <MilestoneInputSectionImageUpload {...props} />
      </div>
    );
  }
};

export default MilestoneInputSection;
