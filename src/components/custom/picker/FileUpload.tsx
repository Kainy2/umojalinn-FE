"use client";
import useFilePicker, { FilePickerOptions } from "@/hooks/useFilePicker";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import React from "react";

type FileUploadPickerProps = FilePickerOptions & {
  cta?: string;
  details?: React.ReactNode;
  rounded?: boolean;
  disabed?: boolean;
};

const FileUploadPicker = (props: FileUploadPickerProps) => {
  const { Input, onClick } = useFilePicker({
    onSelect: props.onSelect,
    accept: props.accept,
    multiple: props.multiple,
  });
  return (
    <button
      onClick={onClick}
      className={cn(
        "border border-gray-300 p-12 flex flex-col items-center",
        props.rounded && "rounded-lg",
        props.disabed && "pointer-events-none"
      )}
    >
      <span className="icon-wrapper mb-2">
        <UploadCloud />
      </span>
      <p className="text-sm">
        <span className="text-primary font-semibold">
          {props.cta || "Click to upload"}
        </span>{" "}
        {props.details || (
          <>
            or drag and drop <br /> Pictures (max. 100mb)
          </>
        )}
      </p>
      <Input />
    </button>
  );
};

export default FileUploadPicker;
