import { z } from "zod";

export const groupAdminSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone_number: z.string().min(8),
  hospital_group_id: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
});
