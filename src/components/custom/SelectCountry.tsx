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

/** Match API / stored country strings to a select option (case-insensitive). */
export const findCountryOption = (country?: string | null) => {
  if (!country?.trim()) return undefined;
  const normalized = country.trim().toLowerCase();
  return options.find((opt) => opt.value.toLowerCase() === normalized);
};

/** Canonical country name from the list, or the trimmed input if unknown. */
export const normalizeCountryName = (
  country?: string | null,
): string | undefined => {
  const trimmed = country?.trim();
  if (!trimmed) return undefined;
  return findCountryOption(trimmed)?.value ?? trimmed;
};

const CustomSelectCountry = (props: CustomReactSelectFieldProps) => {
  const countryValue =
    typeof props.value === "string" ? props.value : undefined;

  return (
    <CustomReactSelectField
      {...props}
      value={findCountryOption(countryValue)}
      options={options}
      filterOption={createFilter(filterConfig)}
    />
  );
};

export default CustomSelectCountry;
