import { useState, useCallback } from "react";

/**
 * Custom hook to generate and manage preview URLs for image files.
 * @param fileList - The FileList object containing files to process.
 * @returns An object with preview URLs and a cleanup function.
 */
export function useImagePreviewUrls() {
  const [previewUrls, setPreviewUrls] = useState<string[] | null>(null);

  const cleanup = useCallback(() => {
    previewUrls?.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls(null);
  }, [previewUrls]);

  const getPreview = useCallback(
    (fileList?: FileList | null) => {
      cleanup();
      if (fileList) {
        const urls: string[] = [];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            urls.push(url);
          }
        }
        setPreviewUrls(urls);
      } else {
        setPreviewUrls(null);
      }
    },
    [cleanup]
  );

  return { previewUrls, cleanup, getPreview };
}
