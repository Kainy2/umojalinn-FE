import { RadioGroupProps } from "@radix-ui/react-radio-group";
import React, { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type CustomRadioGroupProps = RadioGroupProps & {
  options?: {
    value: string;
    label: string;
  }[];
};

const CustomRadioGroup = (props: CustomRadioGroupProps) => {
  const { options, ...radioGroupProps } = props;
  const id = useId();
  return (
    <RadioGroup {...radioGroupProps}>
      {options?.map((option, index) => (
        <div className="flex items-center space-x-2" key={option.value}>
          <RadioGroupItem
            value={option.value}
            id={`radio-group-item-${index + 0}-${id}`}
          />
          <Label htmlFor={`radio-group-item-${index + 0}-${id}`}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
