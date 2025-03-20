import React from "react";
import { CustomTabProps } from "@/components/custom/tab";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormFieldProps } from "../input/TextField";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type CustomTabButtonSelectprops = Omit<
  CustomTabProps,
  "type" | "replace"
> & {
  type?: "NAVIGATOR" | "DEFAULT";
  size?: "default" | "large";
};

// export type TabButtonSelectProps = CustomTabButtonSelectprops & FieldProps;
export type FormTabButtonSelectProps = CustomTabButtonSelectprops &
  FormFieldProps;

const TabButtonSelect = (props: CustomTabButtonSelectprops) => {
  const { type = "DEFAULT", size = "default" } = props;

  return (
    <div
      className={cn(
        "p-1 bg-gray-100 flex gap-1",
        type === "DEFAULT" && "rounded",
        props.className,
      )}
    >
      {props?.tabs?.map?.((tab, index) => {
        const active = tab.value
          ? props.active === tab.value
          : props.active === tab.title;

        const Comp = tab?.href ? Link : "button";

        return (
          <Comp
            type="button"
            href={tab?.href || "#"}
            disabled={props.disabled}
            key={index}
            className={cn(
              "px-3 py-2 text-foreground-body shrink-0 disabled:cursor-not-allowed flex-1 text-center",
              size === "large" && "px-4 py-3",
              active &&
                (type === "DEFAULT"
                  ? "bg-background border border-primary text-primary"
                  : "bg-background text-foreground shadow-sm shadow-gray-200/50 rounded-sm font-medium"),
            )}
            onClick={(e) => {
              props.onChange?.(tab.value);
              // @ts-expect-error event type
              tab.onClick?.(e);
            }}
          >
            {tab.title}
          </Comp>
        );
      })}
    </div>
  );
};

export const FormTabButtonSelect = (props: FormTabButtonSelectProps) => {
  const { label, hint, containerClassName, ...inputProps } = props;
  return (
    <FormItem className={(containerClassName || "") + ""}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <TabButtonSelect {...inputProps} />
      </FormControl>
      {hint && <FormDescription>{hint}</FormDescription>}
      <FormMessage className="pt-2" />
    </FormItem>
  );
};

export default TabButtonSelect;
