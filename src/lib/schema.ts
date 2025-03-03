import { EXPERIENCE_ENUMS_VALUES } from "@/section/form/project/edit/RequirementAndBudget";
import { z } from "zod";
// import { isPhoneValid } from "./utils";

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
  });

export const registrationFormSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "Please provide a valid name.",
    }),
    lastName: z.string().min(1, {
      message: "Please provide a valid name.",
    }),
    email: z.string().email({
      message: "Please provide a valid email.",
    }),
    password: passwordValidation,
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please provide valid email.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Please provide valid email.",
  }),
});

export const resetPasswordFormSchema = z
  .object({
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

export const onboardingDetailsFormSchema = z
  .object({
    gender: z.string().optional(),
    dateOfBirth: z.union([z.date().nullable().optional(), z.string()]),
    phoneNumber: z.string().optional(),
  })
  // .refine((data) => !data.phoneNumber || isPhoneValid(data.phoneNumber), {
  //   message: "Phone number not valid.",
  //   path: ["phoneNumber"],
  // })
  .refine((data) => !!data.dateOfBirth, {
    message: "Field cannot be empty.",
    path: ["dateOfBirth"],
  });

export const onboardingAddressFormSchema = z.object({
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

export const projectFormDetailsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  designerId: z.string().optional(),
  about: z.string().optional(),
  title: z.string().max(30).optional(),
  gender: z.string().optional(),
  additionalNotes: z.string().optional(),
  dueDate: z.union([z.string(), z.date()]).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  clothingTypes: z.array(z.string()).max(8).optional(),
  submit: z.string().optional(),
  sizingTemplateId: z.string().optional(),
});

export const projectFormDetailsKeys = projectFormDetailsSchema?.keyof().options;

export const requirementsAndBugetSchema = z.object({
  currency: z.string().optional(),
  specialist: z.string().optional(),
  experienceLevel: z.string().optional(),
  budget: z
    .union([
      z.string().regex(/^\d+$/, "Budget must be a valid number"),
      z.number(),
    ])
    .optional(),
  negotiable: z.boolean().optional(),
});

export const languageProficiency = [
  "BEGINNER",
  "INTERMEDIATE",
  "FLUENT",
  "NATIVE",
] as const;

export const updateProfileSchema = z.object({
  about: z.string().max(300, "Bio must be at most 300 characters").optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  brandName: z.string().optional(),
  tag: z.string().min(1, "Tag is required"),
  gender: z.enum(["MALE", "FEMALE", "RATHER_NOT_SAY"]),
  dateOfBirth: z.union([z.date().nullable(), z.string()]).optional(),
  email: z.string().email("Invalid email address"),
  alternativeEmail: z
    .string()
    .email("Invalid email address")
    .nullable()
    .optional(),
  specialistType: z.string().optional(),
  clothingTypes: z
    .array(z.string())
    .max(8, "Select only up to 8 clothing types")
    .optional(),
  experienceLevel: z.enum([...EXPERIENCE_ENUMS_VALUES]).nullable(),
  languages: z.array(
    z.object({
      name: z.string().min(1, "Language name is required"),
      languageProficiency: z.enum(languageProficiency),
    }),
  ),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip/Postal code is required"),
  address: z.string().min(1, "Home address is required"),
});

export const updateProfileKeys = updateProfileSchema?.keyof().options;

export const passwordUpdateSchema = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const notificationSettingsSchema = z.object({
  tagPushNotifications: z.boolean(),
  tagEmailNotifications: z.boolean(),
  reminderPushNotifications: z.boolean(),
  reminderEmailNotifications: z.boolean(),
  productUpdates: z.boolean(),
  productUpdatesEmail: z.boolean(),
});

export const notificationSettingsKey =
  notificationSettingsSchema?.keyof().options;
