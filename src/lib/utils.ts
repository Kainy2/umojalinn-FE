import { RegistrationSchemaProps } from "@/types/form";
import { clsx, type ClassValue } from "clsx";
import { PhoneNumberUtil } from "google-libphonenumber";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPasswordField(name: keyof RegistrationSchemaProps) {
  return ["password", "confirmPassword"].includes(name);
}

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Converts a JSON object to a FormData instance.
 * @param jsonObject - The JSON object to convert.
 * @returns A FormData instance containing the JSON object's data.
 */
export function jsonToFormData<T extends Record<string, unknown>>(
  jsonObject: T
): FormData {
  const formData = new FormData();

  const appendToFormData = (key: string, value: unknown) => {
    if (value instanceof File) {
      // Append File instances directly
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Handle arrays by appending each element as key[]
      value.forEach((item, index) => {
        const arrayKey = `${key}[${index}]`;
        appendToFormData(arrayKey, item);
      });
    } else if (typeof value === "object" && value !== null) {
      // Handle nested objects recursively
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendToFormData(`${key}.${nestedKey}`, nestedValue);
      });
    } else if (typeof value === "undefined") {
      return;
    } else {
      // Append primitive values
      formData.append(key, value != null ? String(value) : "");
    }
  };

  Object.entries(jsonObject).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  return formData;
}
