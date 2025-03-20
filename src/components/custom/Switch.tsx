import React, { useId } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { SwitchProps } from "@radix-ui/react-switch";
import { LabelProps } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const CustomSwitch = (
  props: SwitchProps &
    Partial<{
      label: LabelProps["children"];
      labelProps: LabelProps;
      wrapperClassName: string;
    }>
) => {
  const { label, labelProps, wrapperClassName, ...switchProps } = props;

  const id = useId();
  const intId = props.id || id;

  return (
    <div className={cn("inline-flex items-center space-x-2", wrapperClassName)}>
      <Switch {...switchProps} id={intId} />
      <Label {...labelProps} htmlFor={intId}>
        {label}
      </Label>
    </div>
  );
};

export default CustomSwitch;
