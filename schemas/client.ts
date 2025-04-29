import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  contactNumber: z.string().min(6, "Invalid contact number"),
  country: z.string().min(1, "Country is required"),
  imageUrl: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const reviewSchema = z.object({
  review: z.string().min(1, "Review is required"),
  numOfStars: z.number().int().min(1).max(5),
  clientId: z.string().min(1, "Client ID is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ClientSchema = z.infer<typeof clientSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
