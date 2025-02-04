import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps, SelectTriggerProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  FieldProps,
  FormFieldProps,
} from "@/components/custom/input/TextField";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    adornment?: boolean;
    renderValue?: (val?: unknown) => React.ReactNode;
    startAdornment?: React.ReactNode;
    value?: string | null;
  }>;

export type CustomSelectFieldProps = CustomSelectProps & FieldProps;
export type FormCustomSelectFieldProps = CustomSelectProps & FormFieldProps;

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
    <SelectItem value={props?.value?.value || ""} className="!py-2">
      {props?.value?.children}
    </SelectItem>
  );
};

const CustomSelect = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  (props, ref) => {
    const {
      placeholder,
      trigger,
      options,
      adornment,
      startAdornment,
      renderValue,
      ...selectProps
    } = props;
    return (
      <Select {...selectProps}>
        <SelectTrigger
          {...trigger}
          ref={ref}
          className={cn(
            "[&>span]:overflow-visible  [&>span]:h-full [&>span]:flex [&>span]:items-center rounded-none h-12",
            adornment &&
              "!ring-transparent focus:!ring-transparent !border-transparent !h-8 m-1",
            startAdornment && "pl-10 relative",
            trigger?.className
          )}
        >
          {startAdornment && (
            <div
              className={cn("absolute inset-y-0 left-0 flex items-center pl-3")}
            >
              {startAdornment}
            </div>
          )}
          {renderValue ? (
            renderValue(selectProps?.value)
          ) : (
            <SelectValue className="" placeholder={placeholder} />
          )}
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
      {hint && <p className="text-sm mt-2 text-foreground-body">{hint}</p>}
    </div>
  );
});

CustomSelectField.displayName = "SelectField";

export const FormCustomSelectField = React.forwardRef<
  HTMLButtonElement,
  FormCustomSelectFieldProps
>(({ label, hint, containerClassName, ...selectProps }, ref) => {
  return (
    <FormItem className={(containerClassName || "") + ""}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <CustomSelect {...selectProps} ref={ref} />
      </FormControl>
      {hint && <FormDescription>{hint}</FormDescription>}
      <FormMessage className="pt-2" />
    </FormItem>
  );
});

FormCustomSelectField.displayName = "FormCustomSelectField";

export default CustomSelect;
