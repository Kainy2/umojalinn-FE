import { z } from "zod";

export const registrationFormSchema = z
  .object({
    email: z.string().email({
      message: "Please provide valid email.",
    }),
    password: z.string().min(8, {
      message: "Password must be 8 characters or more.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be 8 characters or more.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword", "password"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please provide valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be 8 characters or more.",
  }),
});
