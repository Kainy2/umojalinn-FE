import { loginFormSchema, registrationFormSchema } from "@/lib/schema";
import { z } from "zod";

export type RegistrationSchemaProps = z.infer<typeof registrationFormSchema>;
export type LoginSchemaProps = z.infer<typeof loginFormSchema>;
export type PasswordFieldKeys = "password" | "confirmPassword";
