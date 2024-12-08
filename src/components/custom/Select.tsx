import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectProps, SelectTriggerProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { FieldProps } from "./TextField";

export type CustomGroupedOptionsProps = {
  type?: "label" | "option";
  value?: string;
  children?: React.ReactNode;
};

export type CustomOptionsProps =
  | CustomGroupedOptionsProps
  | Array<CustomOptionsProps>;

export type CustomSelectProps = SelectProps &
  Partial<{
    placeholder: string;
    trigger: SelectTriggerProps;
    options: Array<CustomOptionsProps>;
  }>;

export type CustomSelectFieldProps = CustomSelectProps & FieldProps;

export const CustomOption = (props: { value: CustomOptionsProps }) => {
  if (Array.isArray(props?.value)) {
    return (
      <SelectGroup>
        {props?.value?.map((val, index) => (
          <CustomOption key={index} value={val} />
        ))}
      </SelectGroup>
    );
  }
  if (props?.value?.type === "label")
    return (
      <SelectLabel className="!py-6">{props?.value?.children}</SelectLabel>
    );
  return (
    <SelectItem value={props?.value?.value || ""} className="!py-6">
      {props?.value?.children}
    </SelectItem>
  );
};

const CustomSelect = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  (props, ref) => {
    const { placeholder, trigger, options, ...selectProps } = props;
    return (
      <Select {...selectProps}>
        <SelectTrigger
          {...trigger}
          ref={ref}
          className={cn(
            "[&>span]:overflow-visible  [&>span]:h-full [&>span]:flex [&>span]:items-center rounded-none h-12",
            trigger?.className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>{<CustomOption value={options || []} />}</SelectContent>
      </Select>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export const CustomSelectField = React.forwardRef<
  HTMLButtonElement,
  CustomSelectFieldProps
>(({ label, hint, ...selectProps }, ref) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5")}>
      {label &&
        (typeof label === "string" ? (
          <Label>{label}</Label>
        ) : (
          <Label {...label} />
        ))}
      <CustomSelect {...selectProps} ref={ref} />
      {hint && <p className="text-sm mt-2">{hint}</p>}
    </div>
  );
});

CustomSelectField.displayName = "SelectField";

export default CustomSelect;
