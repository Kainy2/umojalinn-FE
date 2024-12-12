"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomSelect, { CustomSelectProps } from "./Select";
import { FieldProps } from "./TextField";
import { Label } from "../ui/label";

type CustomDateRangeProp = { from: Date; to: Date };

type CustomDatePickerDefaultProp = {
  type?: "default";
  value?: Date;
  onChange?: (value: Date) => void;
  preset?: Pick<CustomSelectProps, "options" | "placeholder">;
  initValue?: Date;
};

type CustomDatePickerRangeProp = {
  type: "range";
  value?: CustomDateRangeProp;
  onChange?: (value: CustomDateRangeProp) => void;
  preset?: undefined;
  initValue?: CustomDateRangeProp;
};

type CustomDatePickerProps =
  | (CustomDatePickerDefaultProp | CustomDatePickerRangeProp) & {
      calendar?: CalendarProps;
      placeholder?: string;
    };

type CustomDatePickerFieldProps = CustomDatePickerProps & FieldProps;

const findIsDate = (date: CustomDatePickerProps["value"]) => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const CustomDatePicker = React.forwardRef<
  HTMLButtonElement,
  CustomDatePickerProps
>((props, ref) => {
  const {
    type = "default",
    value,
    onChange,
    preset,
    initValue,
    calendar,
    placeholder,
  } = props;
  const [intDate, setIntDate] = React.useState<Date | undefined>(
    // @ts-expect-error Generic
    findIsDate(initValue) ? initValue : undefined
  );
  const [intDateRange, setIntDateRange] = React.useState<
    CustomDateRangeProp | undefined
    // @ts-expect-error Generic
  >(!findIsDate(initValue) ? initValue : undefined);

  const isDefault = type === "default";

  const date = React.useMemo(() => {
    return value || (isDefault ? intDate : intDateRange);
  }, [intDate, intDateRange, isDefault, value]);

  const isDate = date instanceof Date;

  const setDate = React.useCallback(
    (value: Date | CustomDateRangeProp | undefined) => {
      const handleChange = isDefault ? setIntDate : setIntDateRange;
      (onChange || handleChange)?.(
        // @ts-expect-error Generic
        isDefault ? value : { from: value?.from, to: value?.to }
      );
    },
    [isDefault, onChange]
  );

  const display = React.useMemo(() => {
    return isDate ? (
      format(date, "PPP")
    ) : date?.from ? (
      date.to ? (
        <>
          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
        </>
      ) : (
        format(date.from, "LLL dd, y")
      )
    ) : (
      <span>{placeholder}</span>
    );
  }, [date, isDate, placeholder]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {display}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0 pt-4 ", {
          "flex flex-col space-y-2 p-2": !!preset,
        })}
      >
        {preset && (
          <CustomSelect
            options={preset?.options}
            placeholder={preset?.placeholder}
            onValueChange={(value) =>
              setDate(addDays(new Date(), parseInt(value)))
            }
          />
        )}
        <div className={cn(preset && "rounded-md border")}>
          <Calendar
            mode={isDefault ? "single" : "range"}
            selected={date}
            captionLayout="dropdown-buttons"
            fromYear={1970}
            toYear={2024}
            // @ts-expect-error Generic
            onSelect={setDate}
            initialFocus
            defaultMonth={!isDate ? date?.from : undefined}
            {...calendar}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});

CustomDatePicker.displayName = "CustomDatePicker";

export const CustomDatePickerField = React.forwardRef<
  HTMLButtonElement,
  CustomDatePickerFieldProps
>(({ label, hint, ...datePickerProps }, ref) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5")}>
      {label &&
        (typeof label === "string" ? (
          <Label>{label}</Label>
        ) : (
          <Label {...label} />
        ))}
      <CustomDatePicker
        calendar={{ captionLayout: "dropdown-buttons" }}
        {...datePickerProps}
        ref={ref}
      />
      {hint && <p className="text-sm mt-2">{hint}</p>}
    </div>
  );
});

CustomDatePickerField.displayName = "CustomDatePickerField";

export default CustomDatePicker;
