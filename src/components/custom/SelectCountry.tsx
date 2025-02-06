import React from "react";
import {
  CustomGroupedOptionsProps,
  CustomSelectField,
  CustomSelectFieldProps,
} from "./Select";
import { countries } from "country-list-json";

const CustomSelectCountry = (props: CustomSelectFieldProps) => {
  const options = countries.map((country) => {
    return {
      type: "option",
      value: country?.name,
      children: (
        <span className="flex gap-2 items-center">
          <span className="text-md rounded-full object-cover overflow-hidden">
            {country?.flag}
          </span>
          <span>{country?.name}</span>
        </span>
      ),
    } as CustomGroupedOptionsProps;
  });
  return (
    <CustomSelectField
      {...props}
      options={options}
      renderValue={(value) =>
        options.find((opt) => opt.value === value)?.children
      }
    />
  );
};

export default CustomSelectCountry;
