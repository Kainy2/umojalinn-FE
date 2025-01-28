import { fileToPreviewUrl } from "@/lib/utils";
import React, { useRef, useState } from "react";

export type FilePickerOptions = {
  accept?: React.ComponentProps<"input">["accept"];
  multiple?: React.ComponentProps<"input">["multiple"];
  onSelect?: (file: File | FileList | null) => void;
};

const useFilePicker = (props: FilePickerOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      (props.multiple ? event.target.files : event.target.files?.[0]) || null;
    props.onSelect?.(file);

    if (file && file instanceof File) {
      setPreview(fileToPreviewUrl(file));
    } else if (file && file instanceof FileList) {
      setPreview(fileToPreviewUrl(file[0]));
    } else {
      setPreview(null);
    }
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

export default useFilePicker;
