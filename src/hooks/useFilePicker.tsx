import { fileToPreviewUrl } from "@/lib/utils";
import React, { useRef, useState } from "react";

export type FilePickerOptions = {
  accept?: React.ComponentProps<"input">["accept"];
  onSelect?: (file: File | null) => void;
};

const useFilePicker = (props: FilePickerOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    props.onSelect?.(file);

    if (file) {
      setPreview(fileToPreviewUrl(file));
    } else {
      setPreview(null);
    }
  };

  return {
    Input: () => (
      <input
        type="file"
        accept={props.accept}
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
