import { FormTextFieldProps } from "@/components/custom/TextField";
import { LoginSchemaProps, RegistrationSchemaProps } from "@/types/form";

export const registrationFormTemplate: Array<
  FormTextFieldProps & {
    name: keyof RegistrationSchemaProps;
  }
> = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "************",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "************",
  },
];

export const loginFormTemplate: Array<
  FormTextFieldProps & {
    name: keyof LoginSchemaProps;
  }
> = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "************",
  },
];
