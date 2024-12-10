import { z } from "zod";
import { isPhoneValid } from "./utils";

export const registrationFormSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "Please provide valid name.",
    }),
    lastName: z.string().min(1, {
      message: "Please provide valid name.",
    }),
    email: z.string().email({
      message: "Please provide valid email.",
    }),
    password: z.string().min(8, {
      message: "Password must be > 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be > 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please provide valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be 8 characters or more.",
  }),
});

export const onboardingDetailsFormSchema = z
  .object({
    gender: z.string().min(1, {
      message: "Invalid field.",
    }),
    dateOfBirth: z.date().nullable(),
    phoneNumber: z.string(),
  })
  .refine((data) => isPhoneValid(data.phoneNumber), {
    message: "Phone number not valid.",
    path: ["phoneNumber"],
  })
  .refine((data) => !!data.dateOfBirth, {
    message: "Field cannot be empty.",
    path: ["dateOfBirth"],
  });

export const onboardingAddressFormSchema = z.object({
  address: z.string().min(1, {
    message: "Field cannot be empty.",
  }),
  country: z.string().min(1, {
    message: "Field cannot be empty.",
  }),
  state: z.string().min(1, {
    message: "Field cannot be empty.",
  }),
  city: z.string().min(1, {
    message: "Field cannot be empty.",
  }),
  zipCode: z.string().min(1, {
    message: "Field cannot be empty.",
  }),
});
