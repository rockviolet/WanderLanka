import { z } from "zod";
export const tourGuideReviewSchema = z.object({
  tourGuideId: z.string().min(1, "Tour Guide ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  numOfStars: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export type TourGuideReviewSchema = z.infer<typeof tourGuideReviewSchema>;
