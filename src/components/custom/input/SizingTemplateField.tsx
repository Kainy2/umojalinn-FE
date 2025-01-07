import { UmojaLinnSizingTemplate } from "@/types/project";
import React, { useId } from "react";

type SizingTemplateInputFieldProps = {
  label: string;
  unit: UmojaLinnSizingTemplate["unit"];
  value: number | string;
  onValueChange: React.ComponentProps<"input">["onChange"];
};

const SizingTemplateInputField = (props: SizingTemplateInputFieldProps) => {
  const id = useId();
  return (
    <div className="flex justify-between p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <label
        className="[&+*>input]:focus:bg-gray-100 bg-background"
        htmlFor={id}
      >
        {props.label}
      </label>
      <div className="focus-visible:outline-none flex p-2 text-xs rounded-full ">
        <input
          className="text-primary placeholder:text-primry"
          id={id}
          type="number"
          min={0}
          max={100}
          onChange={props.onValueChange}
          value={props.value}
        />
        <span>{props.unit}</span>
      </div>
    </div>
  );
};

export default SizingTemplateInputField;
