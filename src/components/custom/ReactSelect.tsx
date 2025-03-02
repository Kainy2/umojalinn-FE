"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Select, { Props, ControlProps, components } from "react-select";
import { FieldProps, FormFieldProps } from "./input/TextField";
import { Label } from "../ui/label";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export type CustomReactSelectProps = Props &
  Partial<{
    adornment?: boolean;
    fullWidth: boolean;
    startAdornment: React.ReactNode;
  }>;

export type CustomReactSelectFieldProps = CustomReactSelectProps & FieldProps;
export type FormCustomReactSelectFieldProps = CustomReactSelectProps &
  FormFieldProps;

const CustomControl: React.FC<
  ControlProps & Pick<CustomReactSelectFieldProps, "startAdornment">
> = ({ children, startAdornment, ...props }) => (
  <components.Control
    {...props}
    getStyles={(prop, opt) => ({
      ...props?.getStyles?.(prop, opt),
      ...(props.isDisabled && {
        backgroundColor: "#f3f4f6",
        opacity: "50%",
        cursor: "not-allowed",
      }),
    })}
  >
    {startAdornment && (
      <span className="relative left-3">{startAdornment}</span>
    )}
    {children}
  </components.Control>
);

const CustomReactSelect = (props: CustomReactSelectProps) => {
  return (
    <Select
      {...props}
      required={false}
      components={{
        Control: (controlProps) => (
          <CustomControl
            {...controlProps}
            startAdornment={props.startAdornment}
          />
        ),
      }}
      className={cn(
        "text-foreground-body", // Adjust width and text size
        !props.adornment &&
          "focus-within:ring-2 focus-within:ring-ring ring-offset-background focus-within:ring-offset-2 focus-within:outline-none focus-within:border-none transition-all duration-100",
        props.adornment && "!focus-within:ring-none !border-transparent !h-9",
        props.fullWidth && "w-full",
        props.className
      )}
      classNames={{
        input: () =>
          cn(
            "text-foreground-body",
            props.adornment ? "!h-7 m-1" : "!h-[38px] px-3 py-2 text-md"
          ),
        indicatorSeparator: () => "opacity-0",
        container: () => "",
        control: () =>
          cn(
            "border !border-input rounded-none text-md !outline-none !ring-none !shadow-none ",
            props.adornment
              ? "!focus:ring-transparent !border-transparent !bg-transparent"
              : "bg-background"
          ),
        placeholder: () =>
          cn("text-muted-foreground", !props.adornment && "px-3"),
        singleValue: () => (props.adornment ? "" : "px-3"),
        multiValue: () => (props.adornment ? "" : "px-3"),
        ...props.classNames,
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: "#FEFDF0",
          primary50: "#FEEE95",
          primary75: "#FAC515",
          danger: "#F04438",
          dangerLight: "#FECDCA",
          primary: "hsl(var(--primary))",
        },
      })}
    />
  );
};

export const CustomReactSelectField: React.FC<CustomReactSelectFieldProps> = ({
  label,
  hint,
  ...selectProps
}) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5")}>
      {label &&
        (typeof label === "string" ? (
          <Label>{label}</Label>
        ) : (
          <Label {...label} />
        ))}
      <CustomReactSelect {...selectProps} />
      {hint && <p className="text-sm mt-2 text-foreground-body">{hint}</p>}
    </div>
  );
};

export const FormCustomReactSelectField: React.FC<
  FormCustomReactSelectFieldProps
> = ({ label, hint, containerClassName, ...selectProps }) => {
  return (
    <FormItem className={(containerClassName || "") + ""}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <CustomReactSelect {...selectProps} />
      </FormControl>
      {hint && <FormDescription>{hint}</FormDescription>}
      <FormMessage className="pt-2" />
    </FormItem>
  );
};

export default CustomReactSelect;
