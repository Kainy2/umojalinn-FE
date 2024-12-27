import {
  loginFormSchema,
  onboardingAddressFormSchema,
  onboardingDetailsFormSchema,
  registrationFormSchema,
  projectFormDetailsSchema,
  requirementsAndBugetSchema,
} from "@/lib/schema";
import { z } from "zod";

export type RegistrationSchemaProps = z.infer<typeof registrationFormSchema>;
export type LoginSchemaProps = z.infer<typeof loginFormSchema>;
export type PasswordFieldKeys = "password" | "confirmPassword";

export type OnboardingProps = {
  details: z.infer<typeof onboardingDetailsFormSchema>;
  address: z.infer<typeof onboardingAddressFormSchema>;
};

export type ProjectFormDetailsProps = z.infer<typeof projectFormDetailsSchema>;
export type ProjectFormRequirementsAndBugetProps = z.infer<
  typeof requirementsAndBugetSchema
>;
