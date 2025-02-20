"use client";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { AxiosError } from "axios";
import { clientConfig } from "@/lib/rollbar";
import Rollbar from "rollbar";

const useHandleError = (errorTitle: string) => {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, onError?: (error: unknown) => void) => {
      console.error(error);
      const rollbar = new Rollbar(clientConfig);
      rollbar.error(error as Error, JSON.stringify(error));
      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError<{
          message: string[] | string;
        }>;
        if (axiosError?.response?.status === 503) {
          toast({
            title: `${errorTitle || ""} error`,
            description: "Please check your network connection",
            variant: "destructive",
          });
          // @ts-expect-error Error message is custom
        } else if (axiosError?.response?.data?.errorMessage) {
          toast({
            title: `${errorTitle || ""} error`,
            description:
              // @ts-expect-error Error message is custom
              axiosError?.response?.data?.errorMessage || "Please try again!",
            variant: "destructive",
          });
        } else if (Array.isArray(axiosError?.response?.data?.message)) {
          axiosError?.response?.data?.message?.map((m) =>
            toast({
              title: `${errorTitle || ""} error`,
              description: m || "Please try again!",
              variant: "destructive",
            })
          );
        } else {
          toast({
            title: `${errorTitle || ""} error`,
            description:
              axiosError?.response?.data?.message ||
              axiosError?.response?.statusText ||
              "Please try again!",
            variant: "destructive",
          });
        }
      } else {
        const genericError = error as Record<string, string>;
        const message = genericError.message || "An unexpected error occurred";
        toast({
          title: `${errorTitle || ""} error`,
          description: message || "Please try again!",
          variant: "destructive",
        });
      }
      onError?.(error);
    },
    [toast, errorTitle]
  );

  return { handleError };
};

export default useHandleError;
