import { fileToPreviewUrl } from "@/lib/utils";
import React, { useRef, useState } from "react";

const useFilePicker = (props: { onSelect?: (file: File | null) => void }) => {
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
        accept="image/*"
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
