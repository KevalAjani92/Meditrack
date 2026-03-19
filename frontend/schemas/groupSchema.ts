import { z } from "zod";

const optionalString = (schema: z.ZodString) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    schema.optional()
  );

export const groupSchema = z.object({
  group_name: z
    .string()
    .trim()
    .min(1, "Group name is required")
    .max(250, "Group name too long"),

  group_code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_]{3,30}$/, {
      message:
        "Group code must be uppercase, 3–30 characters, no spaces, only letters, numbers, underscore",
    }),

  registration_no: optionalString(
    z.string().trim().max(100, "Registration number too long")
  ),

  contact_phone: optionalString(
    z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-]{6,15}$/, {
        message: "Enter valid contact phone number",
      })
  ),

  contact_email: optionalString(
    z
      .string()
      .trim()
      .email("Invalid email address")
      .max(150, "Email too long")
  ),

  description: optionalString(
    z.string().trim().max(500, "Description too long")
  ),
});