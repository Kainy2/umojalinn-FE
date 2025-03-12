import { fileToPreviewUrl, formatSize } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useToast } from "./use-toast";

export type FilePickerOptions = {
  accept?: React.ComponentProps<"input">["accept"];
  multiple?: React.ComponentProps<"input">["multiple"];
  onSelect?: (file: File | FileList | null, previewUrl?: string | null) => void;
};

const useFilePicker = (props: FilePickerOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      (props.multiple ? event.target.files : event.target.files?.[0]) || null;

    let preview: string | null = null;

    if (file && file instanceof File) {
      preview = fileToPreviewUrl(file);
    } else if (file && file instanceof FileList) {
      preview = fileToPreviewUrl(file[0]);
    }

    setPreview(preview);
    props.onSelect?.(file, preview);
  };

  return {
    Input: () => (
      <input
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
    ),
    previewUrl: preview,
    onClick: () => inputRef.current?.click?.(),
  };
};

export const useFileSizeError = (
  limit: number,
  title: string = "File size exceeded"
) => {
  const { toast } = useToast();

  const isFileSizeValid = (file: File | FileList | Array<File | FileList>) => {
    const size = calculateSize(file);
    const valid = size <= limit;
    if (!valid) {
      toast({
        title: `${title} error`,
        description: `The file size limit is ${formatSize(
          limit
        )} and your file upload size is ${formatSize(size)}. You can compress the image using an image editor and try uploading again.`,
        variant: "destructive",
      });
    }
    return valid;
  };

  return { isFileSizeValid };
};

const calculateSize = (
  file: File | FileList | Array<File | FileList>,
  size: number = 0
): number => {
  if (file instanceof File) {
    return size + file.size;
  } else if (file instanceof FileList || Array.isArray(file)) {
    return Array.from(file).reduce(
      (total, item) => calculateSize(item, total),
      size
    );
  }
  return size;
};

export default useFilePicker;
