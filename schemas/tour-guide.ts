import { z } from "zod";

export const tourGuideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  nicNumber: z.string().min(10, "NIC number must be at least 10 characters"),
  contactNumber: z.string().min(6, "Invalid contact number"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isActive: z.boolean().optional(),
  imageUrl: z.string().optional(),
  serviceAreas: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
});

export type TourGuideSchema = z.infer<typeof tourGuideSchema>;

export const tourGuideUpdateSchema = tourGuideSchema
  .partial()
  .omit({ password: true });

export type TourGuideUpdateSchema = z.infer<typeof tourGuideUpdateSchema>;

export const tourGuideCreateSchema = tourGuideSchema.omit({
  isActive: true,
});

export type TourGuideCreateSchema = z.infer<typeof tourGuideCreateSchema>;
