import React from "react";
import TextField from "../input/TextField";
import FileUploadPicker from "../picker/FileUpload";
import { MilestoneStatus, MilestoneTimelineItem } from "./Timeline";
import { useImagePreviewUrls } from "@/hooks/useImagePreviewUrls";
import Image from "next/image";
import { Trash2 } from "lucide-react";

type MilestoneInputSectionProps = {
  isBuyer?: boolean;
  isDesigner?: boolean;
  onMessageChange?: (message: string) => void;
  onFilesChange?: (files: FileList | null) => void;
  message?: string;
  files?: FileList | null;
  status?: MilestoneTimelineItem["status"];
};

const MilestoneInputSection = (props: MilestoneInputSectionProps) => {
  const { previewUrls, getPreview } = useImagePreviewUrls();

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
