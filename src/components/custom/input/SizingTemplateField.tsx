import { cn } from "@/lib/utils";
import { UmojaLinnSizingTemplate } from "@/types/project";
import React, { useId } from "react";

type SizingTemplateInputFieldProps = {
  label: string;
  unit: UmojaLinnSizingTemplate["unit"];
  value?: number;
  onValueChange?: React.ComponentProps<"input">["onChange"];
  onFocus?: React.ComponentProps<"input">["onFocus"];
  disabled?: boolean;
};

const SizingTemplateInputField = (props: SizingTemplateInputFieldProps) => {
  const id = useId();
  return (
    <div className="flex justify-between items-center p-2 text-foreground-body focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 m-1 transition-all">
      <label
        className="[&+*>input]:focus:bg-gray-100 bg-background"
        htmlFor={id}
      >
        {props.label}
      </label>
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
    </div>
  );
};

export default SizingTemplateInputField;
