import { RegistrationSchemaProps } from "@/types/form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPasswordField(name: keyof RegistrationSchemaProps) {
  return ["password", "confirmPassword"].includes(name);
}
