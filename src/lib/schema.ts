import { z } from "zod";

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
      message: "Password must be 8 characters or more.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be 8 characters or more.",
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
