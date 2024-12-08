import { FormTextFieldProps } from "@/components/custom/TextField";
import { LoginSchemaProps, RegistrationSchemaProps } from "@/types/form";

export type RegistrationFormItemProps = FormTextFieldProps & {
  name: keyof RegistrationSchemaProps;
};

export type LoginFormItemProps = FormTextFieldProps & {
  name: keyof LoginSchemaProps;
};

export type NestedFormTextFieldProps =
  | Array<RegistrationFormItemProps | LoginFormItemProps>
  | Array<Array<RegistrationFormItemProps | LoginFormItemProps>>;

// @ts-expect-error Generic
export const registrationFormTemplate: NestedFormTextFieldProps = [
  [
    {
      name: "firstName",
      label: "First name",
      placeholder: "John",
    },
    {
      name: "lastName",
      label: "Last name",
      placeholder: "Doe",
    },
  ],
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "johndoe@gmail.com",
  },
  [
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
  ],
];

export const loginFormTemplate: NestedFormTextFieldProps = [
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
