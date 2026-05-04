import { z } from "zod";

export const UNIVERSITY_TYPES = ["public", "private"] as const;
export const ACCREDITATION_STATUSES = [
  "accredited",
  "pending",
  "not_accredited",
] as const;

const optionalNullableUrl = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "Enter a valid URL")
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalNullableText = z
  .string()
  .transform((v) => (v.trim() === "" ? null : v))
  .nullable()
  .optional();

export const universityFormSchema = z.object({
  name_en: z.string().min(1, "English name is required").max(255),
  name_ar: z.string().min(1, "Arabic name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only"
    ),
  overview: z.string().min(1, "Overview is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required").max(255),
  country: z.string().min(1, "Country is required").max(255),
  type: z.enum(UNIVERSITY_TYPES),
  accreditation_status: z.enum(ACCREDITATION_STATUSES),
  established_year: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .nullable()
    .optional(),
  student_count: z.number().int().nonnegative().nullable().optional(),
  acceptance_rate: z.number().min(0).max(100).nullable().optional(),
  tuition_min: z.number().int().nonnegative().nullable().optional(),
  tuition_max: z.number().int().nonnegative().nullable().optional(),
  is_featured: z.boolean().default(false),
  logo_url: optionalNullableUrl,
  cover_image: optionalNullableUrl,
  website_url: optionalNullableUrl,
  email: z
    .string()
    .email("Enter a valid email")
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: optionalNullableText,
  address: optionalNullableText,
});

export type UniversityFormData = z.infer<typeof universityFormSchema>;
