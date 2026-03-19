import * as z from "zod";

export const emergencyContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  relation: z.string().min(2, "Relation is required"),
  isPrimary: z.boolean().default(false),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

export const patientRegistrationSchema = z.object({
  // Step 1: Basic Info
  fullName: z.string().min(2, "Full name is required"),
  gender: z.enum(["Male", "Female", "Other", ""]),
  dob: z.string().min(1, "Date of birth is required"),
  age: z.union([z.number(), z.string()]).optional(),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  state_id: z
    .number()
    .nullable()
    .refine((val) => val !== null, {
      message: "State is required",
    }),

  city_id: z
    .number()
    .nullable()
    .refine((val) => val !== null, {
      message: "City is required",
    }),
  pincode: z.string().min(4, "Pincode is required"),

  // Step 2: Medical Details
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),

  // Step 3: Emergency Contacts
  emergencyContacts: z.array(emergencyContactSchema),
});

export type PatientRegistrationData = z.infer<typeof patientRegistrationSchema>;