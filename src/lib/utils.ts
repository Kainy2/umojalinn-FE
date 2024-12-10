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
