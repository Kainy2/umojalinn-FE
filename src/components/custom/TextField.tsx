import React from "react";
import { Input, InputProps } from "../ui/input";
import { Label } from "../ui/label";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";

export type TextFieldProps = InputProps &
  Partial<{
    label: React.ComponentProps<"label"> | string;
    hint: string;
  }>;
export type FormTextFieldProps = InputProps &
  Partial<{ label: string; hint: string }>;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, ...inputProps }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5")}>
        {label &&
          (typeof label === "string" ? (
            <Label>{label}</Label>
          ) : (
            <Label {...label} />
          ))}
        <Input {...inputProps} ref={ref} />
        {hint && <p className="text-sm mt-2">{hint}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ label, hint, ...inputProps }, ref) => {
    return (
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input ref={ref} {...inputProps} />
        </FormControl>
        {hint && <FormDescription>{hint}</FormDescription>}
        <FormMessage className="pt-2" />
      </FormItem>
    );
  }
);

FormTextField.displayName = "FormTextField";

export default TextField;
export { FormTextField };
