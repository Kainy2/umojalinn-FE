"use client";
import React from "react";
import FileUploadPicker from "../FileUpload";
// import { useImagePreviewUrls } from "@/hooks/useImagePreviewUrls";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";
import {  removeFileFromFileList } from "@/lib/utils";
import useNewFilePicker from "@/hooks/useNewFilePicker";
import { IMilestoneInputSectionImageUploadProps } from "./@types";

const MilestoneInputSectionImageUpload = (
  props: IMilestoneInputSectionImageUploadProps
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

export default MilestoneInputSectionImageUpload;
