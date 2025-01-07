import React from "react";
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
import { Textarea } from "@/components/ui/textarea";

export type FieldProps = Partial<{
  label: React.ComponentProps<"label"> | string;
  hint: string;
}>;

export type FormFieldProps = FieldProps &
  Partial<{
    containerClassName: ClassValue;
    label: string;
  }>;

export type TextAreaFieldProps = React.ComponentProps<"textarea"> & FieldProps;
export type FormTextAreaFieldProps = React.ComponentProps<"textarea"> &
  FormFieldProps;

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, hint, ...inputProps }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5")}>
        {label &&
          (typeof label === "string" ? (
            <Label>{label}</Label>
          ) : (
            <Label {...label} />
          ))}
        <Textarea {...inputProps} ref={ref} />
        {hint && <p className="text-sm text-foreground-body">{hint}</p>}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

const FormTextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  FormTextAreaFieldProps
>(({ label, hint, containerClassName, ...inputProps }, ref) => {
  return (
    <FormItem className={(containerClassName || "") + ""}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Textarea ref={ref} {...inputProps} />
      </FormControl>
      {hint && <FormDescription>{hint}</FormDescription>}
      <FormMessage className="pt-2" />
    </FormItem>
  );
});

FormTextAreaField.displayName = "FormTextAreaField";

export default TextAreaField;
export { FormTextAreaField };
