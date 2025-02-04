"use client";
import { cn } from "@/lib/utils";
import React from "react";
import {
  PhoneInput,
  PhoneInputRefType,
  type PhoneInputProps,
} from "react-international-phone";
import { FieldProps } from "@/components/custom/input/TextField";
import { Label } from "@/components/ui/label";

const CustomPhonePicker = React.forwardRef<PhoneInputRefType, PhoneInputProps>(
  (props, ref) => {
    return (
      <PhoneInput
        ref={ref}
        disableDialCodeAndPrefix
        showDisabledDialCodeAndPrefix
        {...props}
        className={cn(
          "p-1.5 pl-4 !text-md w-full flex  h-12 border border-input",
          props.disabled && "!bg-gray-400/10 !text-foreground-secondary",
          props.className
        )}
        inputClassName={cn(
          "p-4 placeholder:text-foreground-placeholder text-foreground !bg-transparent !border-transparent !w-full !text-md",
          props.inputClassName
        )}
        countrySelectorStyleProps={{
          ...props.countrySelectorStyleProps,
          className: cn(
            "text-typograph !bg-blue !border-transparent",
            props.countrySelectorStyleProps?.className
          ),
          buttonClassName: cn(
            "!bg-transparent !border-transparent",
            props.countrySelectorStyleProps?.buttonClassName
          ),
          flagClassName: cn(
            "!bg-transparent !border-transparent",
            props.countrySelectorStyleProps?.flagClassName
          ),
          dropdownStyleProps: {
            ...props.countrySelectorStyleProps?.dropdownStyleProps,
            listItemStyle: {
              paddingTop: "10px",
              paddingBottom: "10px",
            },
          },
        }}
        dialCodePreviewStyleProps={{
          ...props.dialCodePreviewStyleProps,
          className: cn(
            "p-4 text-typograph !bg-purple !border-transparent  !text-md",
            props.dialCodePreviewStyleProps?.className
          ),
        }}
      />
    );
  }
);

CustomPhonePicker.displayName = "CustomPhonePicker";

export const CustomPhonePickerField = React.forwardRef<
  PhoneInputRefType,
  PhoneInputProps & FieldProps
>(({ label, hint, ...inputProps }, ref) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5")}>
      {label &&
        (typeof label === "string" ? (
          <Label>{label}</Label>
        ) : (
          <Label {...label} />
        ))}
      <CustomPhonePicker {...inputProps} ref={ref} />
      {hint && <p className="text-sm mt-2 text-foreground-body">{hint}</p>}
    </div>
  );
});

CustomPhonePickerField.displayName = "CustomPhonePickerField";
export default CustomPhonePicker;
