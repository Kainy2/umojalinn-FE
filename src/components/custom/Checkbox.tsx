import { CheckboxProps } from "@radix-ui/react-checkbox";
import React from "react";
import { FieldProps } from "./TextField";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type CustomCheckboxProps = CheckboxProps & FieldProps;

const CustomCheckbox = (props: CustomCheckboxProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Checkbox {...props} />
      <label
        htmlFor={props.id}
        className={cn(
          "text-md font-normal text-foreground-label leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          typeof props.label !== "string" && props.label?.className
        )}
      >
        {typeof props.label === "string" ? props.label : props.label?.children}
      </label>
    </div>
  );
};

export default CustomCheckbox;
