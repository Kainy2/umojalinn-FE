import React from "react";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { InfoIcon } from "lucide-react";

export type FieldProps = Partial<{
  label: React.ComponentProps<"label"> | string;
  hint: string;
  hinticon: boolean;
}>;

export type FormFieldProps = FieldProps &
  Partial<{
    containerClassName: ClassValue;
    label: string;
  }>;

export type TextFieldProps = InputProps & FieldProps;
export type FormTextFieldProps = InputProps & FormFieldProps;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, hinticon = false, ...inputProps }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5")}>
        {label &&
          (typeof label === "string" ? (
            <Label>{label}</Label>
          ) : (
            <Label {...label} />
          ))}
        {hint && (
          <div className="flex gap-2">
            {hinticon && <InfoIcon className="w-4 h-4 text-foreground-body" />}{" "}
            <p className="text-sm text-foreground-body">{hint}</p>
          </div>
        )}
        <Input {...inputProps} ref={ref} />
      </div>
    );
  },
);

TextField.displayName = "TextField";

const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ label, hint, containerClassName, ...inputProps }, ref) => {
    return (
      <FormItem className={(containerClassName || "") + ""}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input ref={ref} {...inputProps} />
        </FormControl>

        {hint && <FormDescription>{hint}</FormDescription>}
        <FormMessage className="pt-2" />
      </FormItem>
    );
  },
);

FormTextField.displayName = "FormTextField";

export default TextField;
export { FormTextField };
