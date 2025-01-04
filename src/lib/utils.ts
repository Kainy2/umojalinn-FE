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
    } else if (Object.prototype.toString.call(value) === "[object Date]") {
      // Append Date instances as strings
      formData.append(key, (value as Date).toISOString());
    } else if (Array.isArray(value)) {
      // Handle arrays by appending each element as key[]
      value.forEach((item, index) => {
        const arrayKey = key === "gallery-images" ? key : `${key}[${index}]`;
        appendToFormData(arrayKey, item);
      });
    } else if (typeof value === "object" && value !== null) {
      // Handle nested objects recursively
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendToFormData(`${key}[${nestedKey}]`, nestedValue);
      });
    } else if (value !== undefined && value !== null && value !== "") {
      // Append primitive values
      formData.append(key, String(value));
    }
  };

  Object.entries(jsonObject).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  return formData;
}

/**
 * Converts a File to a preview URL.
 *
 * @param file - The file to be converted.
 * @returns A string representing the preview URL or null if the input is invalid.
 */
export function fileToPreviewUrl(file: File | string): string | null {
  if (!file) {
    console.error("No file provided.");
    return null;
  }

  if (typeof file === "string") {
    return file;
  }

  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating preview URL:", error);
    return null;
  }
}

/**
 * Releases the memory allocated for a preview URL.
 *
 * @param url - The URL to be revoked.
 */
export function revokePreviewUrl(url: string): void {
  if (url) {
    URL.revokeObjectURL(url);
    console.log("Preview URL revoked:", url);
  } else {
    console.error("No URL provided to revoke.");
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ParsedNumber = {
  value: number | null;
  type: "integer" | "float" | "partial" | "invalid";
};

/**
 * Converts a string to an integer, float, or first few valid digits,
 * while removing meaningless starting or trailing zeros.
 * @param input - The string to parse.
 * @returns An object indicating the parsed value and its type.
 */
export function parseStringToNumber(input: string): ParsedNumber {
  const trimmedInput = input.trim();

  // Remove meaningless leading zeros (e.g., "00123" => "123", but keep "0.123")
  const normalizedInput = trimmedInput.replace(/^(-?)0+(?=\d)/, "$1");

  // Check if the normalized input is a valid integer
  if (/^-?\d+$/.test(normalizedInput)) {
    return { value: parseInt(normalizedInput, 10), type: "integer" };
  }

  // Check if the normalized input is a valid float
  if (/^-?\d+\.\d+$/.test(normalizedInput)) {
    // Remove trailing zeros from decimals (e.g., "123.4500" => "123.45")
    const normalizedFloat = normalizedInput
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");
    return { value: parseFloat(normalizedFloat), type: "float" };
  }

  // Extract the first valid digits, removing leading zeros
  const match = normalizedInput.match(/-?\d+(\.\d+)?/);
  if (match) {
    const partialValue = parseFloat(
      match[0]
        .replace(/^(-?)0+(?=\d)/, "$1")
        .replace(/(\.\d*?)0+$/, "$1")
        .replace(/\.$/, "")
    );
    return { value: partialValue, type: "partial" };
  }

  // If no valid number is found
  return { value: null, type: "invalid" };
}
