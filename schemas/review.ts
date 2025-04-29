import { z } from "zod";
export const reviewSchema = z.object({
  review: z.string().min(1, "Review is required"),
  numOfStars: z.number().int().min(1).max(5),
  clientId: z.string().min(1, "Client ID is required"),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
