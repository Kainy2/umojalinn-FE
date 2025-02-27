import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";
import { Info } from "lucide-react";
import Image from "next/image";
import React, { useId } from "react";
import RequestSizingTemplateViewCard from "../card/RequestSIzingTemplateView";

type SizingTemplateInputFieldProps = {
  label: string;
  unit: UmojaLinnSizingTemplate["unit"];
  value?: number;
  onValueChange?: React.ComponentProps<"input">["onChange"];
  onFocus?: React.ComponentProps<"input">["onFocus"];
  disabled?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  hasLiveProject?: boolean;
  metadata?: {
    review?: string;
    img?: string;
  };
};

const SizingTemplateInputField = (props: SizingTemplateInputFieldProps) => {
  const id = useId();
  return (
    <div
      onClick={props.onClick}
      className={cn(
        "flex justify-between items-center p-2 text-foreground-body focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 m-1 transition-all",
        props.highlighted && "ring-2 ring-offset-2 ring-ring"
      )}
    >
      <label
        className={cn(
          "[&+*>input]:focus:bg-gray-100 bg-background",
          props.metadata?.review &&
            !props.hasLiveProject &&
            "text-error-700 font-semibold"
        )}
        htmlFor={id}
      >
        {props.label}
      </label>
      <div className="flex items-center gap-2">
        <div className="text-sm rounded-full relative">
          <input
            className={cn(
              "text-primary text-right placeholder:text-primary focus-visible:outline-none focus-visible:bg-gray-100 rounded-full p-1 pr-10",
              props.unit === "INCH" && "pr-14"
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
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            {props.unit}
          </div>
        </div>

        {props.metadata && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="lg:hidden text-primary [&>svg]:size-5">
                <Info />
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
};

export default SizingTemplateInputField;
