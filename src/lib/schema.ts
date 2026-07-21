import { MAX_PROFILE_ABOUT_COUNT } from "@/constant";
import { z } from "zod";

// import { isPhoneValid } from "./utils";
export const EXPERIENCE_ENUMS_VALUES = [
  "ONE_TO_TWO_YEARS",
  "THREE_TO_FIVE_YEARS",
  "SIX_TO_EIGHT_YEARS",
  "NINE_PLUS_YEARS",
] as const;

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
  country: z.string({ message: "Please provide valid country." }).min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

/** OTP to confirm wallet payment account connect/disconnect actions */
export const paymentAccountOtpFormSchema = z.object({
  otp: z
    .string()
    .min(4, "Enter the verification code")
    .max(12, "Invalid code")
    .regex(/^\d+$/, "Code should only contain digits"),
});

/** @deprecated use paymentAccountOtpFormSchema */
export const stripeDisconnectOtpFormSchema = paymentAccountOtpFormSchema;

/** Stripe payout / Connect onboarding address (matches payment settings Stripe Address fields) */
export const stripeLinkAddressFormSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State / Province is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip / Postal code is required"),
  address: z.string().min(1, "Address is required"),
});

const projectFormDetailsSchemaBase = z.object({
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
  clothingTypes: z.array(z.string()).max(8, "Maximum 8 categories can be selected").optional(),
  submit: z.string().optional(),
  sizingTemplateId: z.string().optional(),
  willProvideMaterials: z.boolean().optional(),
})

export const projectFormDetailsSchema = projectFormDetailsSchemaBase.superRefine((data, ctx) => {
  const fields = ["city", "address", "state", "zipCode"] as const;
  const values = fields.map((f) => data[f]);
  const anyFilled = values.some((v) => v && v.trim() !== "");
  const allFilled = values.every((v) => v && v.trim() !== "");

  if (anyFilled && !allFilled) {
    fields.forEach((field) => {
      if (!data[field] || data[field]?.trim() === "") {
        ctx.addIssue({
          path: [field],
          code: z.ZodIssueCode.custom,
          message: "This field is required when any address field is filled.",
        });
      }
    });
  }
});

export const projectFormDetailsKeys = projectFormDetailsSchemaBase?.keyof().options;

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
  about: z.string().max(MAX_PROFILE_ABOUT_COUNT, "Bio must be at most 1000 characters").optional(),
  firstName: z.string().min(1, "First Name is required").optional(),
  lastName: z.string().min(1, "Last Name is required").optional(),
  brandName: z.string().optional(),
  tag: z.string().min(1, "Tag is required").optional(),
  gender: z.enum(["MALE", "FEMALE", "RATHER_NOT_SAY"]).optional(),
  dateOfBirth: z.union([z.date(), z.string()]).optional(),
  email: z.string().email("Invalid email address").optional(),
  alternativeEmail: z.string().email("Invalid email address").nullable().optional(),
  specialistType: z.string().optional(),
  clothingTypes: z.array(z.string()).max(8, "Maximum 8 categories can be selected").optional(),
  experienceLevel: z.enum(EXPERIENCE_ENUMS_VALUES).nullable().optional(),
  // Uncomment and adjust if using languages:
  // languages: z
  //   .array(
  //     z.object({
  //       name: z.string().min(1, "Language name is required"),
  //       languageProficiency: z.enum(languageProficiency),
  //     }),
  //   )
  //   .optional(),
  phoneNumber: z.string()
    .transform(val => (val.trim().length < 5 ? undefined : val)) // <5 → undefined
    .optional()
    .refine(
      val => val === undefined || val.length >= 12,
      "Invalid phone number"
    )
    // .superRefine((val, ctx) => {
    //   if (val !== undefined && val.length < 12) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Invalid phone number", // your message
    //     });
    //   }
    // })
    ,
  country: z.string().min(1, "Country is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  zipCode: z.string().min(1, "Zip/Postal code is required").optional(),
  address: z.string().min(1, "Home address is required").optional(),
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
  tagWhatsAppNotifications: z.boolean(),
  reminderPushNotifications: z.boolean(),
  reminderEmailNotifications: z.boolean(),
  reminderWhatsAppNotifications: z.boolean(),
  productUpdates: z.boolean(),
  productUpdatesEmail: z.boolean(),
  productUpdatesWhatsApp: z.boolean(),
});

export const notificationSettingsKey =
  notificationSettingsSchema?.keyof().options;
