"use client";
import { useToast } from "./use-toast";
import useHandleError from "./useHandleError";

const useClipboard = () => {
  const { toast } = useToast();
  const { handleError } = useHandleError("Clipboard");
  const handleCopy = async (textToCopy: string) => {
    try {
      // Copy text to clipboard
      await navigator.clipboard.writeText(textToCopy);
      toast({
        description: "Copied to clipboard!",
      });
    } catch (err) {
      handleError(err);
    }
  };
  return {
    handleCopy,
  };
};

export default useClipboard;
