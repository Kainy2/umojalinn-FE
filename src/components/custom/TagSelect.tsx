import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Cross } from "lucide-react";
import { FieldProps, FormFieldProps } from "./TextField";
import { Label } from "../ui/label";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type CustomTagSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  options?: { label: string; value: string }[];
  className?: ClassValue;
};

export type CustomTagSelectFieldProps = CustomTagSelectProps & FieldProps;
export type FormCustomTagSelectFieldProps = CustomTagSelectProps &
  FormFieldProps;

const CustomTagSelect = (props: CustomTagSelectProps) => {
  const { value, onChange, options, className } = props;
  const [intVal, setIntVal] = useState<string[]>(value || []);

  const handleToggle = (id: string) => {
    let newValue: string[] = [];
    if (intVal?.includes(id) || value?.includes(id)) {
      newValue = intVal?.filter((item) => item !== id) as string[];
    } else {
      newValue = [...new Set(...intVal, id)] as string[];
    }
    setIntVal(newValue);
    onChange(newValue);
  };

  return (
    <div
      className={cn(
        // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
        "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 flex-wrap flex gap-2 min-h-12 w-full border border-gray-300 border-input bg-background px-4 py-3 text-md ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-100",
        className
      )}
    >
      {options?.map((opt) => {
        const active =
          intVal?.includes(opt.value) || value?.includes(opt.value);
        return (
          <Badge
            key={opt.value}
            onClick={() => handleToggle(opt.value)}
            className={cn(
              "cursor-pointer font-normal rounded-md flex flex-1 text-foreground-body",
              !!active && "bg-primary-50 "
            )}
            variant="outline"
          >
            {opt.label} {!!active && <Cross />}
          </Badge>
        );
      })}
    </div>
  );
};

export default CustomTagSelect;

const CustomTagField = React.forwardRef<
  HTMLInputElement,
  CustomTagSelectFieldProps
>(({ label, hint, ...tagSelectProps }) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5")}>
      {label &&
        (typeof label === "string" ? (
          <Label>{label}</Label>
        ) : (
          <Label {...label} />
        ))}
      <CustomTagSelect {...tagSelectProps} />
      {hint && <p className="text-sm text-foreground-body">{hint}</p>}
    </div>
  );
});

CustomTagField.displayName = "CustomTagField";

const FormCustomTagSelectField = React.forwardRef<
  HTMLInputElement,
  FormCustomTagSelectFieldProps
>(({ label, hint, containerClassName, ...tagSelectProps }) => {
  return (
    <FormItem className={(containerClassName || "") + ""}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <CustomTagSelect {...tagSelectProps} />
      </FormControl>
      {hint && <FormDescription>{hint}</FormDescription>}
      <FormMessage className="pt-2" />
    </FormItem>
  );
});

FormCustomTagSelectField.displayName = "FormCustomTagSelectField";

export { FormCustomTagSelectField, CustomTagField };
