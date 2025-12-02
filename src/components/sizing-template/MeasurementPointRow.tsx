"use client";
import React, { useId, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";
import { MessageCircleQuestion } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import RequestSizingTemplateViewCard from "@/components/custom/card/RequestSIzingTemplateView";

type MeasurementPointRowProps = {
  label: string;
  unit: UmojaLinnSizingTemplate["unit"];
  value?: number;
  onValueChange?: React.ComponentProps<"input">["onChange"];
  onFocus?: React.ComponentProps<"input">["onFocus"];
  disabled?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  hasLiveProject?: boolean;
  onKeyDown?: React.ComponentProps<"input">["onKeyDown"];
  metadata?: {
    review?: string;
    img?: string;
  };
};

const MeasurementPointRow = forwardRef<
  HTMLInputElement,
  MeasurementPointRowProps
>((props, ref) => {
  const id = useId();

  return (
    <div
      onClick={props.onClick}
      className={cn(
        "flex justify-between items-center p-3 rounded-lg transition-all cursor-pointer",
        props.highlighted
          ? "bg-primary text-white"
          : "bg-white border border-gray-200 hover:border-gray-300"
      )}
    >
      <label
        className={cn(
          "text-sm font-medium",
          props.highlighted
            ? "text-white"
            : "text-foreground-body",
          props.metadata?.review &&
            !props.hasLiveProject &&
            !props.highlighted &&
            "text-error-700 font-semibold"
        )}
        htmlFor={id}
      >
        {props.label}
      </label>
      <div className="flex items-center gap-2">
        <div className="text-sm rounded-full relative">
          {props.disabled ? (
            <span
              className={cn(
                "text-right pr-10",
                props.unit === "INCH" && "pr-14",
                props.highlighted ?"text-white" : "text-gray-500"
              )}
            >
              {props.value || 0}
            </span>
          ) : (
            <input
              ref={ref}
              className={cn(
                "text-right placeholder:text-gray-400 focus-visible:outline-none rounded-full p-1 pr-10 w-20",
                props.unit === "INCH" && "pr-14",
                props.highlighted
                  ? "bg-white/10 text-white transition-all placeholder:text-white/70"
                  : "text-gray-500 focus-visible:bg-gray-100"
              )}
              id={id}
              type="number"
              min={0}
              max={100}
              maxLength={2}
              onChange={props.onValueChange}
              value={props.value || ""}
              placeholder="0"
              onFocus={props.onFocus}
              autoComplete="off"
              disabled={props.disabled}
              onClick={props.onClick}
              onKeyDown={props.onKeyDown}
            />
          )}
          <div
            className={cn(
              "absolute inset-y-0 right-0 top-0.5 flex items-center pr-4 pointer-events-none text-xs",
              props.highlighted ? "text-white" : "text-gray-500"
            )}
          >
            {props.unit}
          </div>
        </div>

        {props.metadata && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className={cn(
                  "lg:hidden",
                  props.highlighted ? "text-white" : "text-primary"
                )}
              >
                <MessageCircleQuestion className="size-5 text-gray-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] max-w-[425px] max-h-[80vh] h-[80vh]">
              <div className="h-full w-full relative">
                <DialogTitle className="text-lg font-semibold mb-4">
                  Preview
                </DialogTitle>
                <div className="h-full w-full relative">
                  <Image
                    src={props.metadata?.img || ""}
                    fill
                    alt=""
                    className="absolute object-contain h-full w-full"
                  />
                  {!!props.metadata?.review && !props.hasLiveProject && (
                    <RequestSizingTemplateViewCard
                      className="absolute top-0"
                      title={props?.label || ""}
                      review={props?.metadata?.review || ""}
                    />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
});

MeasurementPointRow.displayName = "MeasurementPointRow";

export default MeasurementPointRow;

