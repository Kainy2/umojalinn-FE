"use client";
import React from "react";
import { countries } from "country-list-json";
import {
  CustomReactSelectField,
  CustomReactSelectFieldProps,
} from "./ReactSelect";

import { createFilter } from "react-select";

const options = countries.map((country) => {
  return {
    value: country?.name,
    label: `${country?.flag} ${country?.name}`,
  };
});

const filterConfig = {
  ignoreCase: true,
  matchFrom: "any" as const,
};

const CustomSelectCountry = (props: CustomReactSelectFieldProps) => {
  // return null;
  return (
    <CustomReactSelectField
      {...props}
      value={options?.find((opt) => opt?.value === props?.value)}
      options={options}
      filterOption={createFilter(filterConfig)}
    />
  );
};

export default CustomSelectCountry;
